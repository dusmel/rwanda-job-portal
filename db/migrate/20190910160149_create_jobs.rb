# frozen_string_literal: true

class CreateJobs < ActiveRecord::Migration[5.2]
  def change
    create_table :jobs do |t|
      t.string :position_name
      t.integer :salary
      t.string :working_hours
      t.text :requirement
      t.text :experience
      t.string :description
      t.integer :user_id

      t.timestamps
    end
  end
end
