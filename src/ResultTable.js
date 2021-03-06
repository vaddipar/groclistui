import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
 

export class ResultTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      selectedRecipes: this.props.location.state.selectedRecipes,
      isLoaded: false,
      fetchedJson: {},
      groclist_session_token: ""
    };
  }

  checkCookieBasedLogin() {
    let session_cookie = Cookies.get("groclist_session_token");
    if (
      session_cookie === null ||
      session_cookie === undefined ||
      session_cookie === "" ||
      session_cookie === false ||
      session_cookie === "false"
    ) {
      this.setState({
        isLoggedIn: false
      });
    } else {
      this.setState({
        groclist_session_token: session_cookie,
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
    let url ="http://localhost:8080/ingredients/?recipes=" + Object.values(this.state.selectedRecipes).join(",");
    let session_cookie = Cookies.get("groclist_session_token");
    console.log(url);
    const authstr = 'Bearer '.concat(session_cookie); 
    axios.get(url, { headers: { Authorization: authstr }}).then(res => {
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
    if (!this.state.isLoggedIn) {
      return <Redirect to="/login"></Redirect>
    } else {
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
          <form>
          <input
            type="button"
            value="Logout"
            onClick={this.handleLogout.bind(this)}
          />
          </form>
        </div>
    ) : (
        <div>Loading...</div>

    );
    }
  }
}
