<?php

return function ($kirby, $site, $page) {
    $language = $kirby->language();

    return [
        'languageOptions' => [
            'currentLanguage' => $language?->code() ?? 'de',
            'languageUrls' => [
                'de' => $page->url('de'),
                'en' => $page->url('en'),
            ],
            'languageTaglines' => [
                'de' => $site->content('de')->tagline()->value(),
                'en' => $site->content('en')->tagline()->value(),
            ],
        ],
    ];
};
