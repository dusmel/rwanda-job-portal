# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  after_update :create_company

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :company
  has_many :applications
  has_many :jobs, through: :applications

  def create_company
    Company.where(user_id: id).first_or_create if account_type == 'company'
  end
end
