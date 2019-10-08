class RenameJobUserIdToCompanyId < ActiveRecord::Migration[5.2]
  def change
	rename_column :jobs, :user_id, :company_id

  end
end
