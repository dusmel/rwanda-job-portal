import React, { Component } from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class FirstTimeModal extends Component {
  state = { open: false };

  componentDidMount() {
    axios.get('profile').then(({ data }) => {
      if (data && data.user.first_time) {
        this.setState({ open: true });
      }
    });
  }

  close = () => this.setState({ open: false });

  render() {
    const { open } = this.state;
    return (
      <>
        <Modal className="modal-home" size="tiny" open={open} onClose={this.close}>
          <Modal.Header>Complete Your Account</Modal.Header>
          <Modal.Content>
            <Link href to="/profile/job-seeker">
              <Button inverted icon size="large" color="orange" labelPosition="right">
                Job Seeker
                <Icon name="user" />
              </Button>
            </Link>
            <Link href to="/profile/company">
              <Button inverted icon size="large" color="orange" labelPosition="right">
                Company
                <Icon name="suitcase" />
              </Button>
            </Link>
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

export default FirstTimeModal;
