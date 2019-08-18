require 'test_helper'

class V1::TaksControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get v1_taks_index_url
    assert_response :success
  end

  test "should get edit" do
    get v1_taks_edit_url
    assert_response :success
  end

  test "should get show" do
    get v1_taks_show_url
    assert_response :success
  end

  test "should get delete" do
    get v1_taks_delete_url
    assert_response :success
  end

end
