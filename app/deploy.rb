set :application, 'HighFive'
set :repo_url, '#'

set :deploy_to, '/home/HighFive/'
set :symfony_env, 'prod'
set :archive_cache, true
set :branch, 'master'
set :scm, :rsync
set :exclude, ['.git', 'node_modules', 'web/app_dev.php']

set :linked_files, fetch(:linked_files, []).push('app/config/parameters.yml')
set :linked_dirs, fetch(:linked_dirs, []).push('app/logs')

namespace :deploy do
    after :updated, :build do
        on roles(:web) do
            execute "cd '#{release_path}';  bin/console --env=#{fetch(:symfony_env)} cache:clear"
            execute "cd '#{release_path}';  bin/console --env=#{fetch(:symfony_env)} doctrine:schema:update --force"
        end
    end
end
