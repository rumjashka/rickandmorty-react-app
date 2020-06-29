import axios from "axios";
import React from "react";
import { print } from "graphql";
import gql from "graphql-tag";
import { backendUrl } from "./config";
import "./Custom.css";

class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = { residents: [], name: "" };
    this.LOCATION = gql`
      query($id: ID) {
        location(id: $id) {
          name
          residents {
            name
          }
        }
      }
    `;
  }

  componentDidMount() {
    axios
      .post(backendUrl, {
        query: print(this.LOCATION),
        variables: {
          id: this.props.match.params.locationId,
        },
      })
      .then((res) => {
        this.setState({
          residents: res.data.data.location.residents,
          name: res.data.data.location.name,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="location">
        <h1>{this.state.name} Residents:</h1>
        <div className="location__block">
          {this.state.residents.map((resident, index) => (
            <div key={index}>
              <div className="card__small">
                <div className="card__content__small">
                  <div className="card__text__small">{resident.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Location;
