const MIN_COMPLETION_HOUR = 6;
const MAX_COMPLETION_HOUR = 12;

class MorningApp extends React.Component {
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      step: props.step,
      saved: false,
      date: date,
      canComplete: false,
      completed: false,
      // a list of Dates
      completions: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validHours = this.validHours.bind(this);
    this.checkCanComplete = this.checkCanComplete.bind(this);
  }

  checkCanComplete() {
    if (!this.validHours(this.state.date.getHours())) {
      return false;
    }
    if (this.state.completions.length == 0) {
      return true;
    }
    const lastCompletion = this.state.completions[this.state.completions.length - 1];
    const hoursSince = (this.state.date - lastCompletion) / 36000;
    if (hoursSince <= MAX_COMPLETION_HOUR - MIN_COMPLETION_HOUR) {
      return false;
    }
    return true;
  }

  validHours(hours) {
    return MIN_COMPLETION_HOUR <= hours && hours <= MAX_COMPLETION_HOUR;
  }

  handleChange(event) {
    this.setState({step: event.target.value});
  }

  handleSubmit(event) { 
    event.preventDefault();
    if (!this.state.canComplete) {
      this.setState({saved: !this.state.canComplete, completed: this.state.canComplete});
      fetch('https://api.keyvalue.xyz/a4408b5f/myKey', {
        method: 'POST',
        body: JSON.stringify({step: this.state.step}),
      });
    } else {
      this.state.completions.push(new Date());
      fetch('https://api.keyvalue.xyz/b49fdc3f/completions', {
        method: 'POST',
        body: JSON.stringify(this.state.completions),
      });
      this.setState({canComplete: false, completed: true, step: ""});
    }
  }

  componentDidMount() {
    fetch('https://api.keyvalue.xyz/a4408b5f/myKey', {
      method: 'GET'
    }).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState(json);
      updateTextAreaHeight();
    });
    fetch('https://api.keyvalue.xyz/b49fdc3f/completions', {
      method: 'GET'
    }).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({completions: json.map(d => new Date(d))});
      this.setState({canComplete: this.checkCanComplete()});
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
          <button type="submit" className={this.state.canComplete? "btn btn-success" : "btn btn-primary"}>
          { this.state.canComplete ? "Mark Completed" : "Save" }
          </button>
        </form>
        <div></div>

        { this.state.saved ? 
        <div className="alert mt-2 alert-success" role="alert">
          Saved. Good luck on your morning step tomorrow.
        </div> : null }

        { this.state.completed ? 
        <div className="alert mt-2 alert-success" role="alert">
          Completed! Good work. That's XXX completions in a row, and {this.state.completions.length} completions so far.
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
  $('textarea#step').height(0).height($(' textarea#step')[0].scrollHeight - 10);
}
$('.form-group').on( 'change keyup keydown paste cut', 'textarea', updateTextAreaHeight).find( 'textarea' ).change();
$(window).resize(updateTextAreaHeight);