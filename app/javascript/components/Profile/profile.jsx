import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Input,
  Menu,
  Segment,
  Form,
  Button,
  Select,
  TextArea,
  Icon,
  Header,
  Table,
  Modal,
  Label,
} from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import {
  fetchProfile,
  updateProfile,
  jobApplications,
  getAllUsers,
  suspendAccount,
  companyApplications,
} from '../../actions/profileAction';
import { createJob, getCompanyJobs, archiveJob } from '../../actions/jobAction';
import './profile.scss';

class Profile extends Component {
  state = {
    company: [
      { tab: 'Profile', path: 'companyProfile' },
      { tab: 'Publish Job', path: 'companyPublishJob' },
      { tab: 'Application', path: 'companyApplication' },
    ],
    jobSeeker: [
      { tab: 'Profile', path: 'jobSeekerProfile' },
      { tab: 'Application', path: 'jobSeekerApplication' },
    ],
    admin: [{ tab: 'Users', path: 'adminUsers' }],
    accountType: '',
    companyOption: [
      { key: 'p', text: 'Private', value: 'private' },
      { key: 'fn', text: 'NGO', value: 'ngo' },
    ],
    maritalStatus: [
      { key: 'm', text: 'Married', value: 'married' },
      { key: 's', text: 'Single', value: 'single' },
    ],
    sex: [{ key: 'm', text: 'Male', value: 'male' }, { key: 'f', text: 'Female', value: 'female' }],
    formLoading: true,
    buttonFormLoading: false,
    form: {},
    modals: {
      addJob: false,
      jobDetails: false,
      currentContent: {},
    },
    status: {
      getJobStatus: false,
      getJobApplicationStatus: false,
      getCompanyApplicationStatus: false,
    },
    archiveButton: '',
  };

  async componentWillMount() {
    const {
      match: {
        params: { type },
      },
      getProfile,
      onGetAllUsers,
      profile,
    } = this.props;
    getProfile();
    this.setState({ accountType: type, formLoading: false });
    switch (type) {
      case 'admin':
        onGetAllUsers();
        console.log('profile:', this.props);
        if (profile.id && type !== profile.account_type) {
          toast.error('Not Authorized');
          window.location.pathname = '/';
        }
        break;

      default:
        break;
    }
  }

  handleItemClick = path => this.setState({ activeItem: path });

  handleChange = (e, { value, name }) => {
    const { form } = this.state;
    this.setState({ form: { ...form, [name]: value } });
  };

  onSubmitProfile = async () => {
    this.setState({ buttonFormLoading: true });
    const {
      profile: { id },
      onUpdateProfile,
    } = this.props;
    const { form, accountType } = this.state;
    if (Object.entries(form).length === 0) {
      toast.warn('Nothing edited');
      this.setState({ buttonFormLoading: false });
    } else {
      form.account_type = accountType;
      onUpdateProfile(form, id);
      setTimeout(() => {
        this.setState({ buttonFormLoading: false, form: {} });
      }, 1000);
    }
  };

  onSubmitPublishJob = async () => {
    this.setState({ buttonFormLoading: true });
    const {
      profile: { company },
      onPublishJob,
    } = this.props;
    const { form, accountType } = this.state;
    if (Object.entries(form).length === 0) {
      toast.warn('Nothing filled');
      this.setState({ buttonFormLoading: false });
    } else {
      form.account_type = accountType;
      onPublishJob(form, company);
      this.closeModal('addJob');
      this.setState({ buttonFormLoading: false, form: {} });
    }
  };

  getAllJobs = async () => {
    const { onGetJobs } = this.props;
    const {
      status: { getJobStatus },
    } = this.state;
    if (!getJobStatus) {
      onGetJobs();
      this.setState({ status: { getJobStatus: true } });
    }
  };

  getAllCompanyApplications = async companyId => {
    const { onGetCompanyApplications } = this.props;
    const {
      status: { getCompanyApplicationStatus },
    } = this.state;
    if (!getCompanyApplicationStatus) {
      onGetCompanyApplications(companyId);
      this.setState({ status: { getCompanyApplicationStatus: true } });
    }
  };

  getJobApplications = async () => {
    const { onGetJobApplications } = this.props;
    const {
      status: { getJobStatus },
    } = this.state;
    if (!getJobStatus) {
      onGetJobApplications();
      this.setState({ status: { getJobStatus: true } });
    }
  };

  onCallArchiveJob = async (jobId, userId) => {
    const { onArchiveJob } = this.props;
    onArchiveJob(jobId, userId);
    const { archiveButton } = this.state;
    if (archiveButton === 'Archive') {
      this.setState({ archiveButton: 'Restore' });
    } else {
      this.setState({ archiveButton: 'Archive' });
    }
  };

  onCallSuspend = async userId => {
    const { onSuspendAccount } = this.props;
    onSuspendAccount(userId);
  };

  jobDetailsModal = company => {
    const {
      modals: { jobDetails, currentContent },
      buttonFormLoading,
      archiveButton,
    } = this.state;
    const {
      profile: { id: userId, account_type: accountType },
    } = this.props;
    return (
      <Modal
        className="job-details-modal"
        onClose={() => this.closeModal('jobDetails')}
        size="small"
        open={jobDetails}
      >
        <Modal.Header as="h2">
          Job Details
          {accountType === 'company' && (
            <Button
              onClick={() => this.onCallArchiveJob(currentContent.id, userId)}
              color="brown"
              floated="right"
              loading={buttonFormLoading}
            >
              {archiveButton}
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
  };

  closeModal = modalName => this.setState({ modals: { [modalName]: false, currentContent: {} } });

  openModal = (modalName, currentContent = {}) => {
    this.setState({
      modals: { [modalName]: true, currentContent },
    });
    console.log('heree');
    if (currentContent.status) {
      this.setState({
        archiveButton: 'Archive',
      });
    } else if (currentContent.status === false) {
      this.setState({
        archiveButton: 'Restore',
      });
    }
  };

  companyProfile() {
    const { companyOption: options, formLoading, buttonFormLoading } = this.state;
    const {
      profile: { email, name, tin_number: tinNumber, company_category: category, description },
    } = this.props;
    if (email) {
      return (
        <>
          <Header as="h2" attached="top" color="brown" className="mt-md-5 mt-2">
            <Icon name="bullseye" />
            Edit Profile
          </Header>
          <Segment attached className="profile-body">
            <Form onSubmit={this.onSubmitProfile} loading={formLoading}>
              <Form.Group widths="equal">
                <Form.Field
                  control={Input}
                  name="name"
                  defaultValue={name || ''}
                  onChange={this.handleChange}
                  label="Company Name"
                  icon="users"
                  iconPosition="left"
                  required
                  placeholder="Company Name"
                />
                <Form.Field
                  control={Input}
                  name="tin_number"
                  onChange={this.handleChange}
                  defaultValue={tinNumber || ''}
                  label="TIN Number"
                  icon="fax"
                  iconPosition="left"
                  required
                  type="number"
                  placeholder="TIN Number"
                />
                <Form.Field
                  control={Select}
                  label="Category"
                  name="company_category"
                  onChange={this.handleChange}
                  options={options}
                  required
                  defaultValue={category}
                  placeholder="Category"
                />
              </Form.Group>
              <Form.Field
                label="About"
                control={TextArea}
                name="description"
                required
                onChange={this.handleChange}
                defaultValue={description || ''}
                type="text"
                placeholder={description || 'Tell us more about the company...'}
              />
              <Form.Button loading={buttonFormLoading} icon labelPosition="right" color="brown">
                Submit
                <Icon name="caret square up outline" />
              </Form.Button>
            </Form>
          </Segment>
        </>
      );
    }
  }

  companyPublishJob() {
    const {
      buttonFormLoading,
      modals: { addJob },
    } = this.state;
    const {
      profile: { email, name, jobs = [] },
    } = this.props;
    if (email) {
      return (
        <>
          <Segment.Group className="mt-md-5 mt-2">
            <Segment className="publish-job-header">
              <Header as="h2" color="brown">
                <Icon name="audio description" />
                Publish Job
              </Header>
              <Button
                content="PUBLISH"
                onClick={() => this.openModal('addJob')}
                color="brown"
                icon="plus"
                labelPosition="right"
              />
            </Segment>
            <Segment className="publish-job-body">
              <Table singleLine color="brown">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Postion Name</Table.HeaderCell>
                    <Table.HeaderCell>Date Posted</Table.HeaderCell>
                    <Table.HeaderCell>Active</Table.HeaderCell>
                    <Table.HeaderCell>Application</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {jobs.map((job, index) => (
                    <Table.Row key={index}>
                      <Table.Cell onClick={() => this.openModal('jobDetails', job)}>
                        <p className="position-name">{job.position_name}</p>
                      </Table.Cell>
                      <Table.Cell>{job.created_at}</Table.Cell>
                      <Table.Cell positive={job.status} negative={!job.status}>
                        {job.status ? 'Yes' : 'No'}
                      </Table.Cell>
                      <Table.Cell>No</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
          </Segment.Group>
          <Modal className="" onClose={() => this.closeModal('addJob')} size="small" open={addJob}>
            <Modal.Header>Add a Job</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.onSubmitPublishJob}>
                <Form.Group widths="equal">
                  <Form.Field
                    control={Input}
                    name="position_name"
                    onChange={this.handleChange}
                    label="Position Name"
                    icon="users"
                    iconPosition="left"
                    required
                    placeholder="Position Name"
                  />
                  <Form.Input
                    labelPosition="right"
                    onChange={this.handleChange}
                    name="salary"
                    label="Salary"
                    iconPosition="left"
                    required
                    type="number"
                    placeholder="Salary"
                  >
                    <Icon name="fax" />
                    <input />
                    <Label>Rwf</Label>
                  </Form.Input>
                </Form.Group>
                <Form.Field
                  control={Input}
                  name="working_hours"
                  onChange={this.handleChange}
                  label="Working Hours"
                  icon="fax"
                  iconPosition="left"
                  required
                  placeholder="Working Hours"
                />
                <Form.Group widths="equal">
                  <Form.Field
                    label="Requirement"
                    control={TextArea}
                    name="requirement"
                    required
                    onChange={this.handleChange}
                    type="text"
                    placeholder="Tell us more about the requirement for this job..."
                  />
                  <Form.Field
                    label="Experience"
                    control={TextArea}
                    name="experience"
                    required
                    onChange={this.handleChange}
                    type="text"
                    placeholder="Experience"
                  />
                </Form.Group>
                <Form.Field
                  label="Tell us more about the job..."
                  control={TextArea}
                  name="description"
                  required
                  onChange={this.handleChange}
                  type="text"
                  placeholder="Tell us more about the job..."
                />
                <Form.Button loading={buttonFormLoading} icon labelPosition="right" color="brown">
                  Submit
                  <Icon name="caret square up outline" />
                </Form.Button>
              </Form>
            </Modal.Content>
          </Modal>
          {this.jobDetailsModal(name)}
        </>
      );
    }
  }

  companyApplication() {
    const {
      buttonFormLoading,
      modals: { addJob },
    } = this.state;
    const {
      profile: { email, AllcompanyApplications = [], name },
    } = this.props;
    if (email) {
      return (
        <>
          <Segment.Group className="mt-md-5 mt-2">
            <Segment className="publish-job-header">
              <Header as="h2" color="brown">
                <Icon name="audio description" />
                Job Applications
              </Header>
              <Button
                content="PUBLISH"
                onClick={() => this.openModal('addJob')}
                color="brown"
                icon="plus"
                labelPosition="right"
              />
            </Segment>
            <Segment className="publish-job-body">
              <Table singleLine color="brown">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Job Title</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Telephone</Table.HeaderCell>
                    <Table.HeaderCell>Education</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {AllcompanyApplications.map(({ job, user }, index) => (
                    <Table.Row key={index}>
                      <Table.Cell onClick={() => this.openModal('jobDetails', job)}>
                        <p className="position-name">{user.name}</p>
                      </Table.Cell>
                      <Table.Cell>{job.position_name}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{user.telephone}</Table.Cell>
                      <Table.Cell>{user.education}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
          </Segment.Group>
          <Modal className="" onClose={() => this.closeModal('addJob')} size="small" open={addJob}>
            <Modal.Header>Add a Job</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.onSubmitPublishJob}>
                <Form.Group widths="equal">
                  <Form.Field
                    control={Input}
                    name="position_name"
                    onChange={this.handleChange}
                    label="Position Name"
                    icon="users"
                    iconPosition="left"
                    required
                    placeholder="Position Name"
                  />
                  <Form.Input
                    labelPosition="right"
                    onChange={this.handleChange}
                    name="salary"
                    label="Salary"
                    iconPosition="left"
                    required
                    type="number"
                    placeholder="Salary"
                  >
                    <Icon name="fax" />
                    <input />
                    <Label>Rwf</Label>
                  </Form.Input>
                </Form.Group>
                <Form.Field
                  control={Input}
                  name="working_hours"
                  onChange={this.handleChange}
                  label="Working Hours"
                  icon="fax"
                  iconPosition="left"
                  required
                  placeholder="Working Hours"
                />
                <Form.Group widths="equal">
                  <Form.Field
                    label="Requirement"
                    control={TextArea}
                    name="requirement"
                    required
                    onChange={this.handleChange}
                    type="text"
                    placeholder="Tell us more about the requirement for this job..."
                  />
                  <Form.Field
                    label="Experience"
                    control={TextArea}
                    name="experience"
                    required
                    onChange={this.handleChange}
                    type="text"
                    placeholder="Experience"
                  />
                </Form.Group>
                <Form.Field
                  label="Tell us more about the job..."
                  control={TextArea}
                  name="description"
                  required
                  onChange={this.handleChange}
                  type="text"
                  placeholder="Tell us more about the job..."
                />
                <Form.Button loading={buttonFormLoading} icon labelPosition="right" color="brown">
                  Submit
                  <Icon name="caret square up outline" />
                </Form.Button>
              </Form>
            </Modal.Content>
          </Modal>
          {this.jobDetailsModal(name)}
        </>
      );
    }
  }

  jobSeekerProfile() {
    const { maritalStatus: options, sex: sexOptions, formLoading, buttonFormLoading } = this.state;
    const {
      profile: {
        email,
        name,
        national_id: NationalId,
        telephone,
        marital_status: status,
        sex,
        education,
        experience,
        description,
      },
    } = this.props;
    if (email) {
      return (
        <>
          <Header as="h2" attached="top" color="brown" className="mt-md-5 mt-2">
            <Icon name="bullseye" />
            Edit Profile
          </Header>
          <Segment attached className="profile-body">
            <Form onSubmit={this.onSubmitProfile} loading={formLoading}>
              <Form.Group widths="equal">
                <Form.Field
                  control={Input}
                  name="name"
                  defaultValue={name || ''}
                  onChange={this.handleChange}
                  label="Full Name"
                  icon="user"
                  iconPosition="left"
                  required
                  placeholder="Full Name"
                />
                <Form.Field
                  control={Input}
                  name="national_id"
                  onChange={this.handleChange}
                  defaultValue={NationalId || ''}
                  label="National Id"
                  icon="microchip"
                  iconPosition="left"
                  required
                  placeholder="National Id"
                />
                <Form.Field
                  control={Input}
                  name="telephone"
                  onChange={this.handleChange}
                  defaultValue={telephone || ''}
                  label="Telephone"
                  icon="phone"
                  iconPosition="left"
                  required
                  placeholder="Telephone"
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field
                  control={Input}
                  name="email"
                  onChange={this.handleChange}
                  value={email || ''}
                  label="Email"
                  icon="at"
                  disabled
                  iconPosition="left"
                  required
                  placeholder="Email"
                />
                <Form.Field
                  control={Select}
                  label="Marital status"
                  name="marital_status"
                  onChange={this.handleChange}
                  options={options}
                  required
                  defaultValue={status}
                  placeholder="Marital status"
                />
                <Form.Field
                  control={Select}
                  label="Sex"
                  name="sex"
                  onChange={this.handleChange}
                  options={sexOptions}
                  required
                  defaultValue={sex}
                  placeholder="Sex"
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field
                  label="Education"
                  control={TextArea}
                  name="education"
                  required
                  onChange={this.handleChange}
                  defaultValue={education || ''}
                  type="text"
                  placeholder="Tell us more about your education..."
                />
                <Form.Field
                  label="Experience"
                  control={TextArea}
                  name="experience"
                  required
                  onChange={this.handleChange}
                  defaultValue={experience || ''}
                  type="text"
                  placeholder="Tell us more about your experience..."
                />
              </Form.Group>
              <Form.Field
                label="Description"
                control={TextArea}
                name="description"
                required
                onChange={this.handleChange}
                defaultValue={description || ''}
                type="text"
                placeholder="Tell us more about you..."
              />
              <Form.Button loading={buttonFormLoading} icon labelPosition="right" color="brown">
                Submit
                <Icon name="caret square up outline" />
              </Form.Button>
            </Form>
          </Segment>
        </>
      );
    }
  }

  jobSeekerApplication() {
    const {
      profile: { email, applications = [] },
    } = this.props;
    if (email) {
      return (
        <>
          <Segment.Group className="mt-md-5 mt-2">
            <Segment className="publish-job-header">
              <Header as="h2" color="brown">
                <Icon name="audio description" />
                Applications
              </Header>
            </Segment>
            <Segment className="publish-job-body">
              <Table singleLine color="brown">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Postion Name</Table.HeaderCell>
                    <Table.HeaderCell>Date Applied</Table.HeaderCell>
                    <Table.HeaderCell>Active</Table.HeaderCell>
                    <Table.HeaderCell>Salary</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {applications.map((job, index) => (
                    <Table.Row key={index}>
                      <Table.Cell onClick={() => this.openModal('jobDetails', job)}>
                        <p className="position-name">{job.position_name}</p>
                      </Table.Cell>
                      <Table.Cell>{job.created_at}</Table.Cell>
                      <Table.Cell positive={job.status} negative={!job.status}>
                        {job.status ? 'Yes' : 'No'}
                      </Table.Cell>
                      <Table.Cell warning>{`${job.salary} Rfw`}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
          </Segment.Group>
          {this.jobDetailsModal('Google Inc')}
        </>
      );
    }
  }

  adminUsers() {
    const {
      match: {
        params: { type },
      },
      profile: { email, users = [], account_type: accountType },
    } = this.props;
    if (type === 'admin' && email && accountType !== 'admin') {
      toast.error('Not Authorized');
      window.location.pathname = '/';
    } else if (email) {
      return (
        <>
          <Segment.Group className="mt-md-5 mt-2">
            <Segment className="publish-job-header">
              <Header as="h2" color="brown">
                <Icon name="setting" />
                Users
              </Header>
            </Segment>
            <Segment className="publish-job-body">
              <Table singleLine color="brown">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Names</Table.HeaderCell>
                    <Table.HeaderCell>Account Type</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Tin Number</Table.HeaderCell>
                    <Table.HeaderCell>Category</Table.HeaderCell>
                    <Table.HeaderCell warning>Action </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {users.map((user, index) => (
                    <Table.Row key={index} negative={user.suspended}>
                      <Table.Cell>
                        <p>{user.name}</p>
                      </Table.Cell>
                      <Table.Cell onClick={() => this.openModal('jobDetails', user)}>
                        <p>{user.account_type}</p>
                      </Table.Cell>
                      <Table.Cell onClick={() => this.openModal('jobDetails', user)}>
                        <p>{user.email}</p>
                      </Table.Cell>
                      <Table.Cell onClick={() => this.openModal('jobDetails', user)}>
                        <p>{user.tin_number || '-'}</p>
                      </Table.Cell>
                      <Table.Cell onClick={() => this.openModal('jobDetails', user)}>
                        <p>{user.company_category || '-'}</p>
                      </Table.Cell>
                      <Table.Cell warning>
                        <Button
                          basic
                          color={user.suspended && 'green'}
                          onClick={() => this.onCallSuspend(user.id)}
                        >
                          {user.suspended ? 'Activate' : 'Suspend'}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
          </Segment.Group>
          {this.jobDetailsModal('Google Inc')}
        </>
      );
    }
  }

  sidebar() {
    const { activeItem, accountType, jobSeeker, company, admin } = this.state;
    let currentTab = accountType === 'company' ? company : jobSeeker;
    const {
      match: {
        params: { type },
      },
    } = this.props;
    if (type === 'admin') {
      currentTab = admin;
    }
    return (
      <Menu vertical className="side-bar mx-auto mt-md-5 mt-2">
        {currentTab.map(({ tab, path }, index) => (
          <Menu.Item
            name={tab}
            key={index}
            active={activeItem === path}
            onClick={() => this.handleItemClick(path)}
          />
        ))}
      </Menu>
    );
  }

  render() {
    const {
      profile: { name, company },
      match: {
        params: { type },
      },
    } = this.props;
    let currentTab = type === 'company' ? this.companyProfile() : this.jobSeekerProfile();
    if (type === 'admin') {
      currentTab = this.adminUsers();
    }
    const { activeItem } = this.state;
    switch (activeItem) {
      case 'companyProfile':
        currentTab = this.companyProfile(name);
        break;
      case 'companyPublishJob':
        this.getAllJobs();
        currentTab = this.companyPublishJob();
        break;
      case 'companyApplication':
        this.getAllCompanyApplications(company);
        currentTab = this.companyApplication();
        break;
      case 'jobSeekerProfile':
        currentTab = this.jobSeekerProfile();
        break;
      case 'jobSeekerApplication':
        this.getJobApplications();
        currentTab = this.jobSeekerApplication();
        break;

      default:
        break;
    }
    return (
      <>
        <ToastContainer />
        <div className="row profile">
          <div className="col-md-3">{this.sidebar()}</div>
          <div className="col-md-7 px-2">{currentTab}</div>
        </div>
      </>
    );
  }
}

Profile.propTypes = {
  match: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getProfile: PropTypes.func.isRequired,
  onUpdateProfile: PropTypes.func.isRequired,
  onPublishJob: PropTypes.func.isRequired,
  onGetJobs: PropTypes.func.isRequired,
  jobs: PropTypes.array.isRequired,
  onArchiveJob: PropTypes.func.isRequired,
  onGetJobApplications: PropTypes.func.isRequired,
  onGetAllUsers: PropTypes.func.isRequired,
  onSuspendAccount: PropTypes.func.isRequired,
  onGetCompanyApplications: PropTypes.func.isRequired,
};

const mapStateToProps = ({ profile, jobs }) => {
  return {
    profile,
    jobs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfile: () => dispatch(fetchProfile()),
    onUpdateProfile: (form, id) => dispatch(updateProfile(form, id)),
    onPublishJob: (form, id) => dispatch(createJob(form, id)),
    onGetJobs: () => dispatch(getCompanyJobs()),
    onArchiveJob: (jobId, userId) => dispatch(archiveJob(jobId, userId)),
    onGetJobApplications: () => dispatch(jobApplications()),
    onGetAllUsers: () => dispatch(getAllUsers()),
    onSuspendAccount: id => dispatch(suspendAccount(id)),
    onGetCompanyApplications: companyId => dispatch(companyApplications(companyId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
