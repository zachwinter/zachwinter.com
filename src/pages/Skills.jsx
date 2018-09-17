import React, { Component } from 'react'
import './Skills.scss'

class Skills extends Component {
  constructor() {
    super()

    this.list = [
      { s: 'Design', e: 10 },
      { s: 'UI Development', e: 9 },
      { s: 'React / Redux', e: 3 },
      { s: 'Angular', e: 3 },
      { s: 'Hybrid Mobile Apps', e: 2 }
    ]

    this.state = {
      count: [0, 0, 0, 0, 0]
    }
  }

  render() {
    return (
      <div className="Skills">
      <ul>
        { this.list.map((skill, i) => <li key={i}>
          <span className="skill">{skill.s}</span>
          <span className="experience"><i>{this.state.count[i]}</i> Years</span>
        </li> )}
      </ul>
    </div>
    )
  }

  componentDidMount() {
    const count = [...this.state.count]

    for (let i = 0; i < this.list.length; i++) {
      let years = 0

      const counter = () => {
        years++
        count[i] = years
        this.setState({ count }, () => {
          if (years < this.list[i].e) {
            setTimeout(() => counter(), 300)
          }
        })
      }

      setTimeout(counter, (i+1) * 500)
    }
  }
}

export default Skills 