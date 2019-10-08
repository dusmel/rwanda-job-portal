# frozen_string_literal: true

class AddAdditionnalColumnsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :name, :string
    add_column :users, :tin_number, :string
    add_column :users, :company_category, :string
    add_column :users, :description, :text
    add_column :users, :telephone, :integer
    add_column :users, :education, :string
    add_column :users, :marital_status, :string
    add_column :users, :experience, :text
  end
end
