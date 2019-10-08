# frozen_string_literal: true

class UsersController < ApplicationController
  protect_from_forgery

  def edit_profile
    @user = User.find(params[:id])
    @user.update(user_params)
    render json: {
      user: @user,
      message: 'Profile successfuly updated'
    }
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  def profile
    @user = current_user
    render json: { user: @user, company: @user.company }, status: 200
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  def all
    @users = User.all
    render json: { users: @users }, status: 200
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  def supend
    @user = User.find(params[:id])
    @user.toggle!(:suspended)
    message = @user.suspended ? "#{@user.name.capitalize} suspended" : "#{@user.name.capitalize} activated"
    render json: { user: @user, message: message }, status: 200
  rescue StandardError => exception
    render json: { message: exception }, status: 400
  end

  private

  def user_params
    params.require(:profile).permit(
      :first_time,
      :name,
      :tin_number,
      :company_category,
      :description,
      :telephone,
      :education,
      :marital_status,
      :experience,
      :national_id,
      :sex,
      :education,
      :account_type
    )
  end
end
