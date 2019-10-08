# frozen_string_literal: true

class AddDefaultValueToUsersFirstTime < ActiveRecord::Migration[5.2]
  def change
    change_column :users, :first_time, :boolean, default: true
  end
end
