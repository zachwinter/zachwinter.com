/**
 * WebGPU Compute Shader for COVID Map Datum Calculations
 *
 * Progressive enhancement: Falls back to CPU if WebGPU unavailable
 */

interface DatumInput {
  coords: Float32Array // [x, y] pairs
  values: Float32Array // raw values per datum
  populations: Float32Array // population per datum
  transform: Float32Array // [x, y, k] - d3 transform
}

interface DatumOutput {
  transformedCoords: Float32Array // [x, y] pairs after transform
  sizes: Float32Array // calculated sizes
}

export default class DatumComputeShader {
  private device: GPUDevice | null = null
  private pipeline: GPUComputePipeline | null = null
  private bindGroup: GPUBindGroup | null = null

  // GPU Buffers
  private coordsBuffer: GPUBuffer | null = null
  private valuesBuffer: GPUBuffer | null = null
  private populationsBuffer: GPUBuffer | null = null
  private transformBuffer: GPUBuffer | null = null
  private scaleBuffer: GPUBuffer | null = null
  private outputCoordsBuffer: GPUBuffer | null = null
  private outputSizesBuffer: GPUBuffer | null = null
  private readBuffer: GPUBuffer | null = null

  public isAvailable: boolean = false
  public isInitialized: boolean = false

  constructor() {}

  /**
   * Initialize WebGPU device and compile shader
   */
  async init(): Promise<boolean> {
    if (!navigator.gpu) {
      console.log('[DatumComputeShader] WebGPU not available')
      return false
    }

    try {
      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) {
        console.log('[DatumComputeShader] No adapter found')
        return false
      }

      this.device = await adapter.requestDevice()
      if (!this.device) {
        console.log('[DatumComputeShader] Failed to get device')
        return false
      }

      this.isAvailable = true
      console.log('[DatumComputeShader] WebGPU initialized successfully')
      return true
    } catch (error) {
      console.warn('[DatumComputeShader] Initialization failed:', error)
      return false
    }
  }

  /**
   * Create compute pipeline and buffers
   */
  async setup(totalDatums: number): Promise<void> {
    if (!this.device || !this.isAvailable) return

    const shaderModule = this.device.createShaderModule({
      label: 'Datum Compute Shader',
      code: this.getShaderCode()
    })

    // Create compute pipeline
    this.pipeline = this.device.createComputePipeline({
      label: 'Datum Pipeline',
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main'
      }
    })

    // Create buffers
    const coordsSize = totalDatums * 2 * Float32Array.BYTES_PER_ELEMENT // x,y pairs
    const valuesSize = totalDatums * Float32Array.BYTES_PER_ELEMENT
    const transformSize = 3 * Float32Array.BYTES_PER_ELEMENT // x,y,k
    const scaleSize = 8 * Float32Array.BYTES_PER_ELEMENT // scale params

    this.coordsBuffer = this.createBuffer(coordsSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST)
    this.valuesBuffer = this.createBuffer(valuesSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST)
    this.populationsBuffer = this.createBuffer(valuesSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST)
    this.transformBuffer = this.createBuffer(transformSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST)
    this.scaleBuffer = this.createBuffer(scaleSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST)

    this.outputCoordsBuffer = this.createBuffer(coordsSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC)
    this.outputSizesBuffer = this.createBuffer(valuesSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC)

    this.readBuffer = this.createBuffer(
      Math.max(coordsSize, valuesSize),
      GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    )

    // Create bind group
    this.bindGroup = this.device.createBindGroup({
      label: 'Datum Bind Group',
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.coordsBuffer } },
        { binding: 1, resource: { buffer: this.valuesBuffer } },
        { binding: 2, resource: { buffer: this.populationsBuffer } },
        { binding: 3, resource: { buffer: this.transformBuffer } },
        { binding: 4, resource: { buffer: this.scaleBuffer } },
        { binding: 5, resource: { buffer: this.outputCoordsBuffer } },
        { binding: 6, resource: { buffer: this.outputSizesBuffer } }
      ]
    })

    this.isInitialized = true
    console.log('[DatumComputeShader] Setup complete for', totalDatums, 'datums')
  }

  private createBuffer(size: number, usage: GPUBufferUsageFlags): GPUBuffer {
    return this.device!.createBuffer({
      size,
      usage
    })
  }

  /**
   * Execute compute shader
   */
  async compute(input: DatumInput, config: {
    perCapita: boolean
    datasetIndex: number
    viewport: [number, number]
  }): Promise<DatumOutput> {
    if (!this.device || !this.pipeline || !this.bindGroup || !this.isInitialized) {
      throw new Error('Compute shader not initialized')
    }

    const totalDatums = input.coords.length / 2

    // Upload data to GPU
    this.device.queue.writeBuffer(this.coordsBuffer!, 0, input.coords)
    this.device.queue.writeBuffer(this.valuesBuffer!, 0, input.values)
    this.device.queue.writeBuffer(this.populationsBuffer!, 0, input.populations)
    this.device.queue.writeBuffer(this.transformBuffer!, 0, input.transform)

    // Pack scale configuration
    const scaleData = new Float32Array([
      config.perCapita ? 1.0 : 0.0,
      config.datasetIndex,
      config.viewport[0],
      config.viewport[1],
      // Scale function params (size scale)
      1, 100, 1000, 10000 // domain values
    ])
    this.device.queue.writeBuffer(this.scaleBuffer!, 0, scaleData)

    // Create command encoder
    const commandEncoder = this.device.createCommandEncoder()
    const passEncoder = commandEncoder.beginComputePass()

    passEncoder.setPipeline(this.pipeline)
    passEncoder.setBindGroup(0, this.bindGroup)

    // Dispatch workgroups (64 threads per workgroup)
    const workgroupSize = 64
    const workgroupCount = Math.ceil(totalDatums / workgroupSize)
    passEncoder.dispatchWorkgroups(workgroupCount)

    passEncoder.end()

    // Copy results to read buffer
    commandEncoder.copyBufferToBuffer(
      this.outputCoordsBuffer!,
      0,
      this.readBuffer!,
      0,
      totalDatums * 2 * Float32Array.BYTES_PER_ELEMENT
    )

    // Submit commands
    this.device.queue.submit([commandEncoder.finish()])

    // Read back coordinates
    await this.readBuffer!.mapAsync(GPUMapMode.READ)
    const coordsData = new Float32Array(this.readBuffer!.getMappedRange().slice(0))
    this.readBuffer!.unmap()

    // Read back sizes
    const sizeEncoder = this.device.createCommandEncoder()
    sizeEncoder.copyBufferToBuffer(
      this.outputSizesBuffer!,
      0,
      this.readBuffer!,
      0,
      totalDatums * Float32Array.BYTES_PER_ELEMENT
    )
    this.device.queue.submit([sizeEncoder.finish()])

    await this.readBuffer!.mapAsync(GPUMapMode.READ)
    const sizesData = new Float32Array(this.readBuffer!.getMappedRange().slice(0))
    this.readBuffer!.unmap()

    return {
      transformedCoords: coordsData,
      sizes: sizesData
    }
  }

  /**
   * WGSL Compute Shader Code
   */
  private getShaderCode(): string {
    return `
      struct Transform {
        x: f32,
        y: f32,
        k: f32,
      }

      struct ScaleConfig {
        per_capita: f32,
        dataset_index: f32,
        viewport_width: f32,
        viewport_height: f32,
        scale_domain_0: f32,
        scale_domain_1: f32,
        scale_domain_2: f32,
        scale_domain_3: f32,
      }

      @group(0) @binding(0) var<storage, read> coords: array<vec2f>;
      @group(0) @binding(1) var<storage, read> values: array<f32>;
      @group(0) @binding(2) var<storage, read> populations: array<f32>;
      @group(0) @binding(3) var<uniform> transform: Transform;
      @group(0) @binding(4) var<uniform> config: ScaleConfig;
      @group(0) @binding(5) var<storage, read_write> output_coords: array<vec2f>;
      @group(0) @binding(6) var<storage, read_write> output_sizes: array<f32>;

      // Linear scale interpolation
      fn scale_linear(value: f32, domain_min: f32, domain_max: f32, range_min: f32, range_max: f32) -> f32 {
        let t = clamp((value - domain_min) / (domain_max - domain_min), 0.0, 1.0);
        return range_min + t * (range_max - range_min);
      }

      // Multi-point scale (like d3.scaleLinear with multiple points)
      fn scale_size(value: f32, viewport_scale: f32) -> f32 {
        // Piecewise linear scale: [1, 100, 1000, 10000] -> [1, 2, 15, 50] * viewport_scale
        if (value <= 1.0) {
          return 1.0 * viewport_scale;
        } else if (value <= 100.0) {
          return scale_linear(value, 1.0, 100.0, 1.0, 2.0) * viewport_scale;
        } else if (value <= 1000.0) {
          return scale_linear(value, 100.0, 1000.0, 2.0, 15.0) * viewport_scale;
        } else {
          return scale_linear(value, 1000.0, 10000.0, 15.0, 50.0) * viewport_scale;
        }
      }

      fn scale_capita(value: f32, viewport_scale: f32) -> f32 {
        // Per capita scale: [0, 0.1, 0.25, 1] -> [1, 2, 3, 20] * viewport_scale
        if (value <= 0.1) {
          return scale_linear(value, 0.0, 0.1, 1.0, 2.0) * viewport_scale;
        } else if (value <= 0.25) {
          return scale_linear(value, 0.1, 0.25, 2.0, 3.0) * viewport_scale;
        } else {
          return scale_linear(value, 0.25, 1.0, 3.0, 20.0) * viewport_scale;
        }
      }

      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) global_id: vec3u) {
        let index = global_id.x;

        // Bounds check
        if (index >= arrayLength(&coords)) {
          return;
        }

        // Read input
        let coord = coords[index];
        let value = values[index];
        let population = populations[index];

        // Calculate viewport scale (matching d3 scaleLinear([0, 1920], [0.5, 1]))
        let viewport_scale = scale_linear(config.viewport_width, 0.0, 1920.0, 0.5, 1.0);

        // Calculate size
        var size: f32;
        if (config.per_capita > 0.5 && population > 0.0) {
          let per_capita_value = (value / population) * 100.0;
          size = scale_capita(per_capita_value, viewport_scale);
        } else {
          size = scale_size(value, viewport_scale);
        }

        // Clamp size
        size = clamp(size, 0.0, 80.0);

        // Apply d3 transform: [x, y] -> [k * x + tx, k * y + ty]
        let transformed = vec2f(
          transform.k * coord.x + transform.x,
          transform.k * coord.y + transform.y
        );

        // Write output
        output_coords[index] = transformed;
        output_sizes[index] = size;
      }
    `
  }

  /**
   * Cleanup GPU resources
   */
  destroy(): void {
    this.coordsBuffer?.destroy()
    this.valuesBuffer?.destroy()
    this.populationsBuffer?.destroy()
    this.transformBuffer?.destroy()
    this.scaleBuffer?.destroy()
    this.outputCoordsBuffer?.destroy()
    this.outputSizesBuffer?.destroy()
    this.readBuffer?.destroy()

    this.device = null
    this.pipeline = null
    this.bindGroup = null
    this.isAvailable = false
    this.isInitialized = false

    console.log('[DatumComputeShader] Destroyed')
  }
}
