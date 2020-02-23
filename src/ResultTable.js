import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
 

export class ResultTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRecipes: this.props.selectedRecipes,
      isLoaded: false,
      fetchedJson: {}
    };
  }

  checkCookieBasedLogin() {
    let session_cookie = Cookies.get("groclist_session_token");
    if (
      session_cookie === null ||
      session_cookie === undefined ||
      session_cookie === "" ||
      session_cookie == false ||
      session_cookie === "false"
    ) {
      this.setState({
        isLoggedIn: false
      });
    } else {
      this.setState({
        isLoggedIn: true
      });
    }
  }

  handleLogout(event) {
    event.preventDefault();
    Cookies.remove("groclist_session_token");
    this.setState({
      isLoggedIn: false
    });
  }

  getIngredients() {
    console.log(this.state.selectedRecipes);
    let url =
      "http://localhost:8080/ingredients/?recipes=" +
      Object.values(this.state.selectedRecipes).join(",");
    console.log(url);
    axios.get(url).then(res => {
      this.setState({
        isLoaded: true,
        fetchedJson: res.data.responseData
      });
    });

  }

  componentDidMount() {
    this.getIngredients();
  }

  render() {
    return this.state.isLoaded ? (
        <div>
          <h1 align="center">Ingredients</h1>
          <table border="1" align="center">
            <tbody>
            {JSON.parse(this.state.fetchedJson).map(function(ingredient, ingredientIndex) {
              return (
                  <tr key={ingredientIndex}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.amount}</td>
                    <td>{ingredient.unit}</td>
                  </tr>
              );
            })}
            </tbody>
          </table>
        </div>
    ) : (
        <div>Loading...</div>

    );
  }
}
