require 'sinatra/base'

class MyApp < Sinatra::Base
  get '/' do
    haml :index
  end

  get '/js/*' do
    content_type :js
    load_js_file("js/#{params[:splat].first}")
  end

  def load_js_file(path)
    basename = File.basename(path, File.extname(path))
    s = ''
    s << "\n"
    s << "/#{'*' * 80}/\n"
    s << "/*  /#{path.ljust(74)} */\n"
    s << "/#{'*' * 80}/\n"
    s << "var #{basename} = (function() {\n"
    Dir[File.join(File.dirname(path), basename, '*.js')].each do |child_path|
      s << indent(load_js_file(child_path), 4)
    end
    s << indent(File.read(path), 4)
    s << "\nreturn #{basename} })();\n\n"
    s
  end

  def indent(s, depth)
    s.lines.map do |line|
      ' ' * depth + line
    end.join
  end
end
