# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    @first_time = current_user.first_time? if user_signed_in?
  end
end
