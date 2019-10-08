import React, { Component } from 'react';
import { Card, Button, Image, Modal, Header, Segment, Placeholder, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import FirstTimeModal from './firstTimeModal';
import { fetchProfile, applyJob } from '../../actions/profileAction';
import { getJobs } from '../../actions/jobAction';
import './home.scss';

export class Home extends Component {
  state = {
    modal: false,
    placeholderClass: {
      rendered: false,
      value: 'd-block m-5',
    },
  };

  componentDidMount() {
    const { onGetJobs, onGetProfile } = this.props;
    onGetJobs();
    onGetProfile();
  }

  closeModal = () => this.setState({ modal: false });

  openModal = (currentContent, company) => {
    this.setState({
      modal: true,
      company,
      currentContent,
    });
  };

  jobDetailsModal = () => {
    const { modal, currentContent, company } = this.state;
    const {
      profile: { id, account_type: accountType },
    } = this.props;
    if (currentContent) {
      return (
        <Modal className="job-details-modal" onClose={this.closeModal} size="small" open={modal}>
          <Modal.Header as="h2">
            Job Details
            {accountType !== 'company' && (
              <Button
                color="green"
                size="medium"
                floated="right"
                onClick={() => this.submitApplication(id, currentContent.id)}
              >
                Apply
              </Button>
            )}
          </Modal.Header>
          <Modal.Content>
            <Header as="h3" dividing>
              Position name
            </Header>
            <Segment>
              <p className="job-title">{currentContent.position_name}</p>
            </Segment>
            <Header as="h3" dividing>
              Working Hours
            </Header>
            <Segment>{currentContent.working_hours}</Segment>
            <Header as="h3" dividing>
              Salary
            </Header>
            <Segment>
              <p className="salary">{`${currentContent.salary} Rfw`}</p>
            </Segment>
            <Header as="h3" dividing>
              Company Name
            </Header>
            <Segment>
              <p>{company}</p>
            </Segment>
            <Header as="h3" dividing>
              Date Posted
            </Header>
            <Segment>
              <p>{currentContent.created_at}</p>
            </Segment>
            <Header as="h3" dividing>
              Requirement
            </Header>
            <Segment>
              <p>{currentContent.requirement}</p>
            </Segment>
            <Header as="h3" dividing>
              Experience
            </Header>
            <Segment>
              <p>{currentContent.experience}</p>
            </Segment>
            <Header as="h3" dividing>
              Description
            </Header>
            <Segment>
              <p>{currentContent.description}</p>
            </Segment>
          </Modal.Content>
        </Modal>
      );
    }
  };

  cardPlaceholder = () => {
    const {
      placeholderClass: { rendered, value: placeholderClass },
    } = this.state;
    if (!rendered) {
      setTimeout(() => {
        this.setState({ placeholderClass: { rendered: true, value: 'd-none m-5' } });
      }, 3000);
    }
    return (
      <>
        <Grid columns={3} stackable className={placeholderClass}>
          {[1, 2, 3].map((v, index) => (
            <Grid.Column key={index}>
              <Segment raised>
                <Placeholder>
                  <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                  <Placeholder.Paragraph>
                    <Placeholder.Line length="medium" />
                    <Placeholder.Line length="short" />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            </Grid.Column>
          ))}
        </Grid>
        <Header as="h1" className="nothing-to-show display-3 text-muted">
          Nothing posted yet!!
        </Header>
      </>
    );
  };

  submitApplication(userId, jobId) {
    const { onSubmitApplication } = this.props;
    onSubmitApplication(userId, jobId);
  }

  render() {
    const {
      jobs: { jobs = [] },
    } = this.props;
    return (
      <>
        <ToastContainer />
        <FirstTimeModal />
        {jobs.length === 0 ? (
          this.cardPlaceholder()
        ) : (
          <div className="row p-5">
            <Card.Group>
              {jobs.map(({ details, company }, index) => (
                <Card key={index}>
                  <Card.Content>
                    <Card.Header>{details.position_name}</Card.Header>
                    <Card.Meta>{company}</Card.Meta>
                    <Card.Description>{details.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button floated="left" basic color="orange">
                      {`${details.salary} Rfw`}
                    </Button>
                    <Button
                      floated="right"
                      onClick={() => this.openModal(details, company)}
                      inverted
                      color="green"
                    >
                      View
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          </div>
        )}
        {this.jobDetailsModal()}
      </>
    );
  }
}

Home.propTypes = {
  jobs: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  onGetJobs: PropTypes.func.isRequired,
  onGetProfile: PropTypes.func.isRequired,
  onSubmitApplication: PropTypes.func.isRequired,
};

const mapStateToProps = ({ profile, jobs }) => {
  return {
    profile,
    jobs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetJobs: () => dispatch(getJobs()),
    onGetProfile: () => dispatch(fetchProfile()),
    onSubmitApplication: (userId, jobId) => dispatch(applyJob(userId, jobId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
