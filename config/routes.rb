Rails.application.routes.draw do
  root 'home#index'
  namespace :v1, defaults: { format: 'json' } do
    get 'things', to: 'things#index'
    get 'taks/index'
  end
  # Forward all requests to StaticController#index but requests
  # must be non-Ajax (!req.xhr?) and HTML Mime type (req.format.html?).
  # This does not include the root ("/") path.
  get '*page', to: 'single_page#index', constraints: ->(req) do
    !req.xhr? && req.format.html?
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
