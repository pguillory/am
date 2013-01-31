require 'sinatra/base'
require 'base64'

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
    s << "var #{basename};\n"
    s << "function define_#{basename}() {\n"
    s << "if (#{basename}) return;\n"
    s << "#{basename} = (function(#{basename}, undefined){\n"

    Dir[File.join(File.dirname(path), basename, '*.wav')].sort.each do |child_path|
      s << load_wav_file(child_path)
    end

    Dir[File.join(File.dirname(path), basename, '*.js')].sort.each do |child_path|
      s << indent(load_js_file(child_path), 4)
    end

    s << indent(File.read(path), 4)

    s << "    ;return #{basename}\n"
    s << "})();\n"
    s << "}\n"
    s << "define_#{basename}();\n\n"
    s
  end

  def load_wav_file(path)
    basename = File.basename(path, File.extname(path))
    data_uri = "data:audio/wav;base64,#{Base64.encode64(File.read(path))}"
    data_uri_string = data_uri.lines.map(&:strip).map(&:inspect).join(" +\n")
    "var #{basename} = new Audio(\n#{indent(data_uri_string, 4)});\n"
  end

  def indent(s, depth)
    s.lines.map do |line|
      ' ' * depth + line
    end.join
  end
end
