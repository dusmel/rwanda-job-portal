# frozen_string_literal: true

class Job < ApplicationRecord
  belongs_to :company
  has_many :applications
  has_many :users, through: :applications
  belongs_to :company

  def created_at
    attributes['created_at'].strftime('%B %d, %Y %H:%M')
  end
end
