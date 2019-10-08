class AddNationalIdToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :national_id, :string
  end
end
