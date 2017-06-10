# encoding: UTF-8
$:.unshift File.dirname(__FILE__)

require 'csv'
require 'json'
require 'digest'
require 'mapper'

pabat_all = {}
countries_parks = []
country_order = []
parks_indexed = []

m = Mapper.new

CSV.read('../assets/static/pabat-all.csv', { :col_sep => ";" }).each_with_index do |line, index|
  next if index == 0

  country_name = line[0]
  pa_name      = line[1]
  question     = line[2]
  value_type   = line[3]
  stakeholder  = line[4]
  value        = line[5].to_i
  potential    = line[6].to_i

  country = m.country_mappings[country_name]
  country_code = m.country_mappings[country_name]["code"]
  pa_code = m.codify_pa(country_name, pa_name)
  value_type_m = m.type_mappings[value_type]
  pa_name_m = m.strip_pa_prefix(country_name, pa_name)

  pabat_all[country_code] ||= {}
  pabat_all[country_code][pa_code] ||= {:name => pa_name_m, :questions => {}}
  pabat_all[country_code][pa_code][:questions][question] ||= {}
  pabat_all[country_code][pa_code][:questions][question][stakeholder] ||= {}
  pabat_all[country_code][pa_code][:questions][question][stakeholder][value_type_m] ||= {value: value, potential: potential}

  if country_order.include? country_code
    if !parks_indexed.include? pa_code
      countries_parks[country_order.index(country_code)][:protected_areas] << {code: pa_code, name: {en: pa_name_m, hr: pa_name_m}}
      parks_indexed << pa_code
    end
  else
    country_order << country_code
    countries_parks << {
      code: country_code,
      name: {
        en: country['en'],
        hr: country['hr']
      },
      protected_areas: [{
        code: pa_code,
        name: {
          en: pa_name_m,
          hr: pa_name_m
        }
      }]
    }
    parks_indexed << pa_code
  end
end

File.open('../assets/static/pabat-all.json', 'w') { |file| file.write(pabat_all.to_json) }
File.open('../assets/static/countries-parks.json', 'w') { |file| file.write(countries_parks.to_json) }

# DEBUG
# File.open('./pabat-all.json', 'w') { |file| file.write(pabat_all.to_json) }
# File.open('./countries-parks.json', 'w') { |file| file.write(countries_parks.to_json) }
