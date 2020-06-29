import axios from "axios";
import React from "react";
import { print } from "graphql";
import gql from "graphql-tag";
import { backendUrl } from "./config";
import "./Custom.css";

class Episode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { episode: { characters: [] } };
    this.EPISODE = gql`
      query($id: ID) {
        episode(id: $id) {
          id
          name
          air_date
          characters {
            name
          }
        }
      }
    `;
  }
  componentDidMount() {
    axios
      .post(backendUrl, {
        query: print(this.EPISODE),
        variables: {
          id: this.props.match.params.lastEpisodeId,
        },
      })
      .then((res) => {
        this.setState({
          episode: res.data.data.episode,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <div className="location">
        <h2>EPISODE {this.state.episode.id}</h2>
        <div className="card__content">
          <div className="card__content__title">{this.state.episode.name}</div>
          <div className="card__content__subtitle">
            DATE: {this.state.episode.air_date}
          </div>
          <h3>CHARACTERS:</h3>
          <div className="location__block">
            {this.state.episode.characters.map((character, i) => (
              <div className="card__small" key={i}>
                <div className="card__content__small">
                  <div className="card__text__small">{character.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Episode;
