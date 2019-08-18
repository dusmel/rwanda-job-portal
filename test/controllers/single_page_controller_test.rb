require 'test_helper'

class SinglePageControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get single_page_index_url
    assert_response :success
  end

end
