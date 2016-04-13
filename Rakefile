task default: :build

directory "bin"

task :build do
  sh "gulp build"
end

task :watch do
  sh "gulp watch"
end

task :get_deps do
  sh "sudo npm install --global gulp-cli surge"
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
  Dir.chdir("bin") do
    sh "surge --domain gamecart-com.surge.sh"
  end
end

task :clean do
  rm_rf "bin"
end
