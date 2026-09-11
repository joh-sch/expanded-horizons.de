<?php

Kirby::plugin('barebone/site-methods', [
    'fileMethods' => [
        'lazyImg' => function (array $options = []) {
            $ratio = $this->width() && $this->height()
                ? $this->width() . '/' . $this->height()
                : null;

            $alt = $this->alt()->value() ?? '';

            if ($this->isResizable() === false) {
                return [
                    'src' => $this->url(),
                    'srcset' => null,
                    'placeholder' => null,
                    'ratio' => $ratio,
                    'alt' => $alt,
                ];
            }

            $width = isset($options['width']) ? min((int) $options['width'], 1500) : null;
            $height = isset($options['height']) ? min((int) $options['height'], 1500) : null;
            $srcsetWidths = $options['srcset'] ?? null;
            $thumbOptions = array_filter([
                'width' => $width,
                'height' => $height,
                'crop' => $options['crop'] ?? null,
                'quality' => $options['quality'] ?? null,
            ], fn ($value) => $value !== null);

            return [
                'src' => $thumbOptions ? $this->thumb($thumbOptions)->url() : $this->url(),
                'srcset' => $srcsetWidths
                    ? $this->srcset(array_map(fn ($size) => min((int) $size, 1500), $srcsetWidths))
                    : null,
                'placeholder' => $this->thumb([
                    'width' => 24,
                    'blur' => 4,
                    'quality' => 40,
                ])->url(),
                'ratio' => $ratio,
                'alt' => $alt,
            ];
        },
    ],
]);
