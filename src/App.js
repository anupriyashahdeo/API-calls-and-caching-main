import React, { Component } from 'react';
import apiKey from './components/config.js';
import axios from 'axios';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import SearchForm from './components/SearchForm';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import NotFound from './components/NotFound';

class App extends Component {
  constructor() {
    super();
    this.state = {
      photos: [],
      tag: 'hiking',
      loading: true
    };
  }

  componentDidMount() {
    const cachedPhotos = localStorage.getItem('cachedPhotos');
    if (cachedPhotos) {
      this.setState({ photos: JSON.parse(cachedPhotos), loading: false });
    } else {
      this.fetchPhotos();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.tag !== prevState.tag) {
      this.fetchPhotos();
    }
  }

  fetchPhotos = () => {
    axios
      .get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&media=photo&tags=${this.state.tag}&safe_search=1&per_page=12&format=json&nojsoncallback=1`
      )
      .then((res) => {
        const photos = res.data.photos.photo;
        this.setState({ photos, loading: false });
        localStorage.setItem('cachedPhotos', JSON.stringify(photos));
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  };

  searchTags = (searchTermObj) => {
    this.setState({
      tag: searchTermObj.search
    });
  };

  addTag = (button) => {
    this.setState({
      tag: button
    });
  };

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <SearchForm searchTags={this.searchTags} />
          <Navbar addTag={this.addTag} />

          {this.state.loading ? (
            <p>Loading results...</p>
          ) : (
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Gallery
                    photos={this.state.photos}
                    tag={this.state.tag}
                    loading={this.state.loading}
                  />
                )}
              />
              <Route
                path="/search/:topic"
                render={() => (
                  <Gallery
                    photos={this.state.photos}
                    tag={this.state.tag}
                    loading={this.state.loading}
                  />
                )}
              />
              <Route component={NotFound} />
            </Switch>
          )}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
