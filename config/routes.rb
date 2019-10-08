# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, path: 'auth', path_names: { sign_in: 'login', sign_out: 'logout', password: 'secret', confirmation: 'verification', unlock: 'unblock', registration: 'register', sign_up: 'cmon_let_me_in' }

  root 'home#index'
  namespace :v1, defaults: { format: 'json' } do
    get 'things', to: 'things#index'
    get 'taks/index'
  end
  scope 'profile' do
    put '/', to: 'users#edit_profile'
    get '/', to: 'users#profile'
    get '/all', to: 'users#all'
    put '/suspend', to: 'users#supend'
  end
  scope 'job' do
    get '/all', to: 'jobs#index'
    get '/company/all', to: 'jobs#company_jobs'
    post '/new', to: 'jobs#new'
    post '/apply', to: 'jobs#apply'
    put '/archive', to: 'jobs#archive'
    get '/my-applications', to: 'jobs#my_applications'
    get '/applications/company/:id', to: 'jobs#company_applications'
  end

  # Forward all requests to StaticController#index but requests
  # must be non-Ajax (!req.xhr?) and HTML Mime type (req.format.html?).
  # This does not include the root ("/") path.
  get '*page', to: 'single_page#index', constraints: lambda { |req|
    !req.xhr? && req.format.html?
  }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
