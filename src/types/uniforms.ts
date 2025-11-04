export type FloatUniform = [string, 0, number]
export type BooleanUniform = [string, 1, boolean]
export type Vec2Uniform = [string, 2, [number, number]]
export type Vec3Uniform = [string, 3, [number, number, number]]
export type Vec4Uniform = [string, 4, [number, number, number, number]]
export type UniformTuple = FloatUniform | BooleanUniform | Vec2Uniform | Vec3Uniform | Vec4Uniform
