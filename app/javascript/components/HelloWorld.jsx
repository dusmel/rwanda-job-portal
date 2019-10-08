import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon, Label } from 'semantic-ui-react';
import { fetchProfile } from '../actions/profileAction';
import './helloWorld.scss';

class HelloWorld extends Component {
  state = {};

  render() {
    const { greeting, changeName } = this.props;
    return (
      <div id="helloWorld">
        <Label>
          Greetings:
          {greeting.greet}
        </Label>
        <Button color="teal" icon labelPosition="left" onClick={() => changeName('Holla!')}>
          <Icon name="circle" />
          Change greetings!
        </Button>
      </div>
    );
  }
}

HelloWorld.propTypes = {
  greeting: PropTypes.string.isRequired,
  changeName: PropTypes.func.isRequired,
};
const mapStateToProps = ({ greeting }) => {
  return {
    greeting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeName: greeting => dispatch(fetchProfile(greeting)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HelloWorld);
