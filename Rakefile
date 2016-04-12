task default: :build

directory "bin"

task :build do
  sh "gulp build"
end

task :watch do
  sh "gulp watch"
end

task :get_deps do
  sh "sudo npm install --global gulp-cli"
  sh "npm install"
end

task :docker do
  sh "docker-compose up"
end

task :docker_rebuild do
  sh "docker-compose rm --force || true"
  sh "docker-compose build"
end

task :deploy, %w[build] do
  sh "surge"
end

task :clean do
  rm_rf "bin"
end
