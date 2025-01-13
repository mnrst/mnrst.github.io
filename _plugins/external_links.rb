Jekyll::Hooks.register :documents, :post_render do |doc|
  if doc.output_ext == ".html"
    site_url = doc.site.config['url']
    doc.output.gsub!(%r{<a\s+href="((?!mailto:|tel:|#{Regexp.escape(site_url)}|/)[^"]+)"(?![^>]*target=)},
      '<a href="\1" target="_blank" rel="noopener noreferrer"')
  end
end
