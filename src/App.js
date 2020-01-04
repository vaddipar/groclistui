import React, {Component} from 'react'
import './App.css'
import axios from 'axios'

class App extends Component {
    weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    meals = ["BreakFast"]

  constructor(props) {
    super(props);
    this.state = {
      recipeList: [],
        selectedRecipes: [],
        fetchedJson: {}
    }
  }

  renderTableHeader() {
    return this.meals.map((key, mealIndex) => {
      return <th key={mealIndex}>{key.toUpperCase()}</th>
    })
  }

  componentDidMount() {
    axios.get(`http://localhost:8080/recipe/all`)
        .then(res => {
          this.setState({ recipeList: res.data });
          // todo: line here will work before lines outside the axios.get
        })
  }

  handleChange(event){
    event.preventDefault();
    console.log(event.target.value);
    this.state.selectedRecipes.push(event.target.value);
  }

  renderTableData() {
    return this.weekDays.map(function (day, dayIndex) {
      return (
          <tr key={dayIndex}>
            <td>{day}</td>
              {
                this.meals.map(function (meal, mealIndex) {
                  return (
                      <td key={mealIndex}>
                        {
                          <select key={meal} onChange={this.handleChange.bind(this)}>
                              <option key="blankOption">Choose Item to Cook</option>
                            {
                              this.state.recipeList.map(function (recipe, recipeIndex) {
                                return <option key={recipeIndex}>{recipe}</option>
                              })
                            }
                          </select>
                        }
                      </td>
                  );
                }.bind(this))
              }
          </tr>
      );
    }.bind(this)) // todo: how does bind work
  }

  handleSubmit(event){
      event.preventDefault();
      console.log(this.state.recipeList);
      let url = 'http://localhost:8080/ingredients/?recipes=' + this.state.selectedRecipes.join(',')
    axios.get(url)
        .then(res => {
          console.log(res.data);
          this.setState({
              fetchedJson: res.data
          })
        })
      this.setState({
          selectedRecipes: []
      })
  }

  render() {
      return (
        <form onSubmit={this.handleSubmit.bind(this)}>
          <table id='students' border="1">
            <tbody>
            <tr>
              <td><b>WeekDay</b></td>
              {
                this.renderTableHeader()
              }
            </tr>
            {this.renderTableData()}
            </tbody>
          </table>
          <input type="submit" value="Submit" />
        </form>

    )
  }
}
export default App
