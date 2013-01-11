require 'sinatra'

get '/' do
  haml :index
end

get '/js/Game' do
  content_type :js
  load_js_file('public/js/Game.js')
  # Dir['public/js/am/*.js'].map{|filename| File.read(filename) }
end

def load_js_file(path)
  # puts "load_js_file(#{path.inspect})"
  basename = File.basename(path, File.extname(path))
  s = "\n\nvar #{basename} = (function() {\n"
  s << indent(File.read(path), 4)
  Dir[File.join(File.dirname(path), basename, '*.js')].each do |child_path|
    s << indent(load_js_file(child_path), 4)
  end
  s << "\nreturn #{basename} })();\n\n"
  s
end

def indent(s, depth)
  s.lines.map do |line|
    ' ' * depth + line
  end.join
end
