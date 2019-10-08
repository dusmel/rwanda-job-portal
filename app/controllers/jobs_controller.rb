# frozen_string_literal: true

class JobsController < ApplicationController
  protect_from_forgery

  def index
    unsuspended_company = User.select { |x| x.suspended == false }
    unsuspended_jobs = unsuspended_company.map do |u|
      u.company&.jobs&.order('created_at DESC')
    end.compact.drop(1).flatten
    active_jobs = unsuspended_jobs.select(&:status)
    if active_jobs.any?
      active_jobs = active_jobs.map { |job| { details: job, company: User.find(job.company.user_id).name } }
    end
    render json: { jobs: active_jobs }, status: 200
  end

  def company_jobs
    @jobs = current_user.company.jobs.order('created_at DESC')
    render json: { jobs: @jobs }, status: 200
  end

  def new
    @job = Job.create(jobs_params)
    render json: { message: 'Job successfully created', job: @job }, status: 200
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  def apply
    # return render json: { message: 'Access denied' }, status: 401 unless user_signed_in?

    @job = Application.create(application_params)
    render json: { message: 'Application submited' }, status: 200
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  def archive
    Job.find(params[:id]).toggle!(:status)
    message = Job.find(params[:id]).status ? 'Job restored' : 'Job archived'
    render json: {
      message: message,
      jobs: User.find(params[:user_id]).company.jobs.reverse
    }, status: 200
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  def my_applications
    render json: {
      jobs: current_user.jobs
    }, status: 200
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  def company_applications
    company_job_ids = Company.find(params[:id]).job_ids
    applications = Application.where(job_id: company_job_ids).map do |application|
      {
        job: application.job,
        user: application.user
      }
    end
    render json: applications, status: 200
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  private

  def jobs_params
    params.require(:job).permit(
      :position_name,
      :salary,
      :working_hours,
      :requirement,
      :experience,
      :description,
      :company_id
    )
  end

  def application_params
    params.require(:application).permit(
      :user_id,
      :job_id
    )
  end
end
