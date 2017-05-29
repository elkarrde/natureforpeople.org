require 'csv'
require 'json'

final_hash = {}
type_dict = {'Importance of value' => 'Exi',
             'Economic importance of value' => 'Eco',
             'Exi' => 'Exi', 'Eco' => 'Eco'}

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
  country = country_dict[sv[0]]
  pa = sv[1]
  question = sv[4]
  type = type_dict[sv[5]]
  group = sv[7]
  value = sv[8].to_i
  potential = sv[10].to_i

  ((((final_hash[country] ||= {})[pa] ||= {})[question] ||= {})[group] ||= {})[type] ||= {value: value, potential: potential}
end

File.open('../assets/static/pabat-all.json', 'w') { |file| file.write(final_hash.to_json) }
