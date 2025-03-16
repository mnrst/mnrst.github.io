jQuery(function () {
    $.getJSON('/search_data.json', function (data) {
        const options = {
            keys: ['title', 'content'],
            includeScore: true,
            threshold: 0.3
        };
        const fuse = new Fuse(data, options);

        $("#site_search").submit(function (event) {
            event.preventDefault();
            const query = $("#search_box").val();
            const results = fuse.search(query);

            display_search_results(results);
        });

        // 検索結果表示関数
        function display_search_results(results) {
            const $search_results = $("#search_results");
            $search_results.empty();

            if (results.length) {
                results.forEach(({ item }) => {
                    const appendString = `<li><a class="post-link" href="${item.url}">${item.title}</a> <span class="post-meta">${item.date.slice(0, 10)}</span></li>`;
                    $search_results.append(appendString);
                });
            } else {
                $search_results.html('<li>見つかりませんでした</li>');
            }
        }
    });
});
