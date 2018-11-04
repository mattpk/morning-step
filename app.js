const {
  Button,
} = window['material-ui'];

class MorningApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }
    return (
      <Button variant="contained" color="primary" onClick={() => this.setState({ liked: true })}>
        Like
      </Button>

    );
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(React.createElement(MorningApp), domContainer);