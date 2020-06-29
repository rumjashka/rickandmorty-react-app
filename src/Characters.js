import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { print } from "graphql";
import gql from "graphql-tag";
import { backendUrl } from "./config";
import "./Custom.css";

class Characters extends React.Component {
  constructor(props) {
    super(props);
    this.page = 1;
    this.state = { characters: [] };
    this.CHARACTERS = gql`
      query($page: Int) {
        characters(page: $page) {
          info {
            count
          }
          results {
            image
            name
            status
            species
            location {
              name
              id
              dimension
            }
            episode {
              name
              id
              episode
            }
          }
        }
      }
    `;
  }

  componentDidMount() {
    this.loadMore();
  }

  lastEpisode(episodes) {
    let lastEpisodeId = 0;
    let lastEpisodeName = "";
    episodes.map((episode) => {
      if (parseInt(episode.id, 10) > lastEpisodeId) {
        lastEpisodeId = parseInt(episode.id, 10);
        lastEpisodeName = episode.name;
      }
    });

    return { lastEpisodeId: lastEpisodeId, lastEpisodeName: lastEpisodeName };
  }

  loadMore() {
    axios
      .post(backendUrl, {
        query: print(this.CHARACTERS),
        variables: {
          page: this.page,
        },
      })
      .then((res) => {
        let result = res.data.data.characters.results;
        result.forEach((character) => {
          let { lastEpisodeId, lastEpisodeName } = this.lastEpisode(
            character.episode
          );
          character.lastEpisodeId = lastEpisodeId;
          character.lastEpisodeName = lastEpisodeName;
        });
        this.setState({
          characters: this.state.characters.concat(result),
        });

        this.page++;
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="main">
        <div className="character__block">
          {this.state.characters.map((character, id) => (
            <div className="card" key={id}>
              <img
                src={character.image}
                alt="character.name"
                className="zoom__character"
              />
              <div className="card__content">
                <div className="card__title">
                  <p>
                    <b>{character.name}</b>
                  </p>
                </div>
                <p className="card__text">
                  STATUS: <b>{character.status}</b>
                </p>
                <p className="card__text">
                  SPECIES: <b>{character.species}</b>
                </p>
                {character.location.id && (
                  <div>
                    <p className="card__text">
                      <span>LAST LOCATION: </span>
                      <Link to={`/location/${character.location.id}`}>
                        <b>{character.location.name}</b>
                      </Link>
                    </p>
                    <p className="card__text">
                      <span>LAST DIMENSION: </span>
                      <b>{character.location.dimension}</b>
                    </p>
                  </div>
                )}
                <p className="card__text">
                  <span>LAST EPISODE: </span>
                  <Link to={`/episode/${character.lastEpisodeId}`}>
                    <b>
                      {character.lastEpisodeId} "{character.lastEpisodeName}"
                    </b>
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="button-more" onClick={this.loadMore.bind(this)}>
          <img className="gif" alt="gif" src="/rick.gif" />
          <div className="card__title">
            <b>LOAD MORE</b>
          </div>
        </div>
      </div>
    );
  }
}

export default Characters;
