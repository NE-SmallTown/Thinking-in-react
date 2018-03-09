// change the 'delayOfFetch' variable below(at line 5), make it lt/gt delayOfPlaceHolder
// 1. when delayOfFetch < delayOfPlaceHolder, don't show the inline placeholder and stay in current page, and when get response, show details page
// e.g. delayOfFetch = 500, delayOfPlaceHolder = 1000
// 2. when delayOfFetch > delayOfPlaceHolder, show the inline placeholder, and when get response, show details page
// e.g. delayOfFetch = 1000, delayOfPlaceHolder = 500

const delayOfFetch = 1000
const delayOfPlaceHolder = 500

// createFetcher.js
const createFetcher = task => {
  let value;

  const promise = task();
  promise.then(v => (value = v));

  return () => {
    if (value === undefined) {
      throw promise;
    }

    return value;
  };
};

// Placeholder.js
class Placeholder extends React.PureComponent {
  state = {
    loading: 'initial'
  }

  componentDidCatch(error) {
    if (typeof error.then === 'function') {
      Promise.race([
        new Promise(
          resolve => setTimeout(() => { resolve('show placeholder') }, this.props.delay)
        ),
        error.then(() => {
          this.setState({ loading: false })
          this.props.onLoadingUpdate(this.state.loading)

          return `don't show placeholder`
        })
      ])
        .then(value => {
          if (value === 'show placeholder') {
            this.setState({ loading: true })
          } else if (value === `don't show placeholder`) {
            this.setState({ loading: false })
          } else {
            alert(`can't reach!`)
          }
          
          this.props.onLoadingUpdate(this.state.loading)
        });
    }
  }

  render() {
    const { children } = this.props;
    const { loading } = this.state;

    return (loading === false || loading === 'initial')
      ? children
      : null;
  }
}


// json.js

const movieList = [
  { id: 100, coverUrl: 'https://images-na.ssl-images-amazon.com/images/M/MV5BNDFmZjgyMTEtYTk5MC00NmY0LWJhZjktOWY2MzI5YjkzODNlXkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_UY209_CR0,0,140,209_AL_.jpg', title: 'Wonder Woman' },
  { id: 202, coverUrl: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_UY209_CR0,0,140,209_AL_.jpg', title: 'Guardians of the Galaxy Vol. 2' },
  { id: 510, coverUrl: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMjQwODQwNTg4OV5BMl5BanBnXkFtZTgwMTk4MTAzMjI@._V1_UY209_CR0,0,140,209_AL_.jpg', title: 'Logan' },
];

const movieDetailsMap = {
  100: {
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/M/MV5BNDFmZjgyMTEtYTk5MC00NmY0LWJhZjktOWY2MzI5YjkzODNlXkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_UY209_CR0,0,140,209_AL_.jpg', title: 'Wonder Woman', desc: 'When a pilot crashes and tells of conflict in the outside world, Diana, an Amazonian warrior in training, leaves home to fight a war, discovering her full powers and true destiny.', extra: 'Director: Patty Jenkins | Stars: Gal Gadot, Chris Pine, Robin Wright, Lucy Davis'
  },
  202: {
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_UY209_CR0,0,140,209_AL_.jpg',
    title: 'Guardians of the Galaxy Vol. 2',
    desc: `The Guardians must fight to keep their newfound family together as they unravel the mystery of Peter Quill's true parentage.`,
    extra: 'Director: James Gunn | Stars: Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel'
  },
  510: {
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMjQwODQwNTg4OV5BMl5BanBnXkFtZTgwMTk4MTAzMjI@._V1_UY209_CR0,0,140,209_AL_.jpg',
    title: 'Logan',
    desc: `In the near future, a weary Logan cares for an ailing Professor X, somewhere on the Mexican border. However, Logan's attempts to hide from the world, and his legacy, are upended when a young mutant arrives, pursued by dark forces.`,
    extra: 'Director: James Mangold | Stars: Hugh Jackman, Patrick Stewart, Dafne Keen, Boyd Holbrook'
  }
}

// hocs

const timeout = seconds => new Promise(
  resolve => setTimeout(resolve, seconds)
);

const fetchMovieDetails = id => timeout(delayOfFetch).then(() => movieDetailsMap[id])

const withFetcher = (fetcherFunc, delay) => WrappedComponent => {
  const cache = new Map

  return class Hoc extends React.Component {
    handleLoadingUpdate = loading => this.props.onLoadingUpdate(loading)

    render() {
      const data = {
        read: (...args) => {
          if (cache.has(this)) {
            return cache.get(this)
          } else {
            let v
            try {
              v = createFetcher(fetcherFunc.bind(null, ...args))()
            } catch (e) {
              e.then(res => { cache.set(this, res) })
              throw e
            }
          }
        }
      };

      return (
        <Placeholder delay={delay} onLoadingUpdate={this.handleLoadingUpdate}>
          <WrappedComponent data={data} {...this.props} />
        </Placeholder>
      )
    }
  }
}

class MovieDetailsPage extends React.Component {
  render() {
    const movieDetails = this.props.data.read(this.props.id)

    return (
      <div>
        <div>cover: <img src={movieDetails.coverUrl} width="250" height="150" /></div>
        <div>title: {movieDetails.title}</div>
        <div>desc: {movieDetails.desc}</div>
        <div>extra: {movieDetails.extra}</div>
      </div>
    )
  }
}
MovieDetailsPage = withFetcher(fetchMovieDetails, delayOfPlaceHolder)(MovieDetailsPage)

class Suspense extends React.Component {
  state = { loading: 'initial', useReplacerChildren: true }

  deferSetState = deferState => {
    this.setState({ deferState })
  }

  handleLoadingUpdate = loading => {
    this.setState({ loading })
  }

  componentDidUpdate(_, prevState) {
    if (
      (prevState.loading === 'initial' && this.state.loading === false)
      || (prevState.loading === true && this.state.loading === false)
    ) {
      this.setState({ useReplacerChildren: false })
    }
  }

  render() {
    const replacerChildren = this.props.children({ deferSetState: this.deferSetState, ...this.state.deferState })

    return (
      <React.Fragment>
        {this.state.useReplacerChildren && this.props.children({ deferSetState: this.deferSetState, isLoading: this.state.loading === true, [this.props.judgeKey]: this.state.deferState && this.state.deferState[this.props.judgeKey] })}
        <div
          style={{ display: this.state.useReplacerChildren ? 'none' : 'block' }}
        >
          {
            Array.isArray(replacerChildren) ? replacerChildren : React.cloneElement(
              replacerChildren, { onLoadingUpdate: this.handleLoadingUpdate }
            )
          }
        </div>
      </React.Fragment>
    )
  }
}

class MovieListPage extends React.Component {
  render() {
    return (
      <div>
        other things
      	<Suspense judgeKey="currentId">
          {({ isLoading, deferSetState, showDetailsPage, currentId }) =>
            showDetailsPage
              ? <MovieDetailsPage id={currentId} />
              : movieList.map(({ coverUrl, id, title }) => (
                <div
                  onClick={() => deferSetState({
                    currentId: id,
                    showDetailsPage: true
                  })}
                  key={id}
                  style={{ marginTop: '20px', border: '1px solid grey' }}
                >
                  <img src={coverUrl} width="50" height="35" />
                  <h3>{title}</h3>
                  {id === currentId && isLoading && <img src="https://thumbs.gfycat.com/AggressiveGrouchyHammerkop-max-1mb.gif" width="30px" height="30px" />}
                </div>
              ))
          }
        </Suspense>
      </div>
    )
  }
}

// APP.js
class App extends React.Component {
  render() {
    return (
      <MovieListPage />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('container'));
