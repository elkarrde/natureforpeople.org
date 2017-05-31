require 'csv'
require 'json'
require 'digest'

pabat_all = {}
countries_parks = []
country_order = []
parks_indexed = []

type_dict = {'Importance of value' => 'Exi',
             'Economic importance of value' => 'Eco',
             'Exi' => 'Exi',
             'Eco' => 'Eco'}

country_dict = {'Bosnia and Herzegovina' => 'BIH',
                'Montenegro' => 'MNE',
                'Croatia' => 'HRV',
                'Albania' => 'ALB',
                'Serbia' => 'SRB',
                'Macedonia' => 'MKD',
                'Kosovo' => 'KOS',
                'Slovenia' => 'SVN',
                'BIH' => 'BIH',
                'MNE' => 'MNE',
                'HRV' => 'HRV',
                'ALB' => 'ALB',
                'SRB' => 'SRB',
                'MKD' => 'MKD',
                'KOS' => 'KOS',
                'SVN' => 'SVN'}

File.open('pa-bat.csv', 'r').each_with_index do |line, index|
  next if index == 0
  sv = line.split(';')
  country = sv[0]
  country_code = country_dict[country]
  pa = sv[1]
  pa_code = Digest::MD5.hexdigest pa
  question = sv[4]
  type = type_dict[sv[5]]
  group = sv[7]
  value = sv[8].to_i
  potential = sv[10].to_i

  ((((pabat_all[country_code] ||= {})[pa_code] ||= {})[question] ||= {})[group] ||= {})[type] ||= {value: value, potential: potential}

  if country_order.include? country_code
    if !parks_indexed.include? pa_code
      countries_parks[country_order.index(country_code)][:protected_areas] << {code: pa_code, name: {en: pa, hr: pa}}
      parks_indexed << pa_code
    end
  else
    country_order << country_code
    countries_parks << {name: {en: country, hr: country} ,code: country_code ,protected_areas: [{code: pa_code, name: {en: pa, hr: pa}}]}
    parks_indexed << pa_code
  end

end

File.open('../assets/static/pabat-all.json', 'w') { |file| file.write(pabat_all.to_json) }
File.open('../assets/static/countries-parks.json', 'w') { |file| file.write(countries_parks.to_json) }

