class MorningApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {step: props.step, saved: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleChange(event) {
    this.setState({step: event.target.value});
  }

  handleSubmit(event) { 
    this.setState({saved: true});
    fetch('https://api.keyvalue.xyz/a4408b5f/myKey', {
      method: 'POST',
      body: JSON.stringify({step: this.state.step}),
    });
    event.preventDefault();
  }

  componentDidMount() {
    fetch('https://api.keyvalue.xyz/a4408b5f/myKey', {
      method: 'GET'
    }).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState(json);
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className = "container pt-3" style={{"maxWidth":"800px"}}>
          <h2 className="text-center">Morning Step</h2>
          <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="step">Tomorrow's morning step will be:</label>
            <textarea wrap="soft" style={{"resize":"none"}} value={this.state.step} onChange={this.handleChange} className="form-control" id="step">
            </textarea>
            <small id="step" className="form-text text-muted">Choose a task that you'll enjoy and finish within half an hour.</small>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
        <div></div>

        { this.state.saved ? 
        <div className="alert mt-2 alert-success" role="alert">
          Saved. Good luck on your morning step tomorrow.
        </div> : null }

        </div>
      </React.Fragment>
    );
  }
}
const domContainer = document.querySelector('#app');
ReactDOM.render(React.createElement(MorningApp), domContainer);


// jquery hack to fix the textbox.
function updateTextAreaHeight() {
  $('textarea#step').height(0).height($('textarea#step')[0].scrollHeight - 10);
}
$('.form-group').on( 'change keyup keydown paste cut', 'textarea', updateTextAreaHeight).find( 'textarea' ).change();
$(window).resize(updateTextAreaHeight);
window.onload = updateTextAreaHeight;