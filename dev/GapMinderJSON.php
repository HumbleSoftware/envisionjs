<?php

class GapMinderJSON {

var $indicators = array(
    'life_expectancy' => 'indicators/life_expectancy_at_birth.csv',
    //'gdp'             => 'indicators/gdp_per_capita_constant_2000.csv',
    'gdp'             => 'indicators/indicatorgapmindergdp_per_capita_ppp.csv',
    'population'      => 'indicators/population.csv'
);

var $json       = '';
var $data       = array();
var $years      = array();
var $countries  = array();
var $countryMap = array();
var $incomplete = array();

function __construct() {

    $this->parseIndicators();
    $this->cleanIndicators();
}

function parseIndicators() {

    foreach ($this->indicators as $indicator => $file) {

        $contents = file_get_contents($file);
        $contents = explode("\n", $contents);

        if (empty($this->years))
            $this->years = array_slice($this->doLine($contents[0]), 1);

        $data[$indicator] = array();
        for ($i = 1; $i < count($contents); $i++) {

            $line = $this->doLine($contents[$i]);

            if (!$line) continue;

            // Country
            $country = array_shift($line);
            if (isset($this->countryMap[$country])) {
                $index = $this->countryMap[$country];
            } else {
                $index = count($this->countries);
                $this->countries[$index]    = $country;
                $this->countryMap[$country] = $index;
            }

            // Data
            $this->data[$indicator][$index] = $line;
        }
    }
}

function cleanIndicators () {

    // Fill zeroes
    foreach ($this->indicators as $indicator => $file) {
        foreach ($this->data[$indicator] as &$values) {
            $temp = 0;
            foreach ($values as $i => &$value) {
                // Use older data forwards
                if (!$value) $value = $temp;
                // Use newer data for inital zeroes
                if ($temp === 0 && $value) {
                    for ($j = 0; $j < $i; $j++) {
                        $values[$j] = $value;
                    }
                }
                $temp = $value;
            }
        }
    }

    // Disgard extra population data
    foreach ($this->data['population'] as &$population) {
        $population = array_slice($population, 38, -2);
    }
}

function getJSON() {

    $pointMap = array('gdp' => 'x', 'life_expectancy' => 'y', 'population' => 'z');
    $jsonData = array();

    // Each year
    foreach ($this->years as $i => $year) {

        $yearData = array();

        // Each country
        foreach ($this->countries as $j => $country) {

            if (!$this->isCountryComplete($j)) continue;

            $point = array();
            foreach ($pointMap as $indicator => $field) {
                $point[] = $this->getPoint($indicator, $j, $i);
            }

            $yearData[] = array($point);
        }

        $jsonData[] = $yearData;
    }

    return json_encode($jsonData);
}

function getPoint($indicator, $countryIndex, $yearIndex) {

    $value = (int) $this->data[$indicator][$countryIndex][$yearIndex];

    if ($indicator == 'population') {
//        echo "$value\t";
        $value = pow(log($value, 10), 2);
//        echo $value."\n";
    }

    if ($indicator == 'gdp') {
        if ($value !== 0) {
            $value = log($value);
        }
    }

    return $value;
}

function doLine ($line) {
    $line = trim($line);
    return $line ? str_getcsv($line) : false;
}

function isCountryComplete ($index) {

    if (empty($this->incomplete)) {

        // Fill indicators
        foreach ($this->indicators as $indicator => $file) {
            foreach ($this->countries as $i => $country) {
                if (!isset($this->data[$indicator][$i])) {
                    $this->incomplete[$i] = array (
                        'country' => $this->countries[$i],
                        'index' => $i,
                        'indicator' => $indicator
                    );
                }
            }
        }
    }

    return !isset($this->incomplete[$index]);;
}

}

$gap = new GapMinderJSON();
echo 'var bubble_data = ';
echo $gap->getJSON();
echo ';';
?>
