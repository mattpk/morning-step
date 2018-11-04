import Button from '@material-ui/core/Button';

const e = React.createElement;

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
ReactDOM.render(e(MorningApp), domContainer);