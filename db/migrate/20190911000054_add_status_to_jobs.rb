class AddStatusToJobs < ActiveRecord::Migration[5.2]
  def change
    add_column :jobs, :status, :boolean, default: true
  end
end
