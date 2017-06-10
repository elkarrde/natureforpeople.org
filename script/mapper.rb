class String
end

class Mapper
  def initialize
    @country_data = {
      "al" => {
        'code' => 'ALB',
        'en' => 'Albania',
        'hr' => 'Albanija'
      },
      "ba" => {
        'code' => 'BIH',
        'en' => 'Bosnia & Herzegovina',
        'hr' => 'Bosna i Hercegovina'
      },
      "hr" => {
        'code' => 'HRV',
        'en' => 'Croatia',
        'hr' => 'Hrvatska'
      },
      "mk" => {
        'code' => 'MKD',
        'en' => 'Macedonia*',
        'hr' => 'Makedonija*'
      },
      "me" => {
        'code' => 'MNE',
        'en' => 'Montenegro',
        'hr' => 'Crna Gora'
      },
      "rs" => {
        'code' => 'SRB',
        'en' => 'Serbia',
        'hr' => 'Srbija'
      },
      "xk" => {
        'code' => 'KOS',
        'en' => 'Kosovo*',
        'hr' => 'Kosovo*'
      },
      "si" => {
        'code' => 'SLV',
        'en' => 'Slovenia',
        'hr' => 'Slovenija'
      }
    }

    @type_mappings = {
      'Importance of value' => 'Exi',
      'Economic importance of value' => 'Eco',
      'Exi' => 'Exi',
      'Eco' => 'Eco'
    }

    @country_mappings = {
      'Bosnia and Herzegovina' => @country_data["ba"],
      'Montenegro'             => @country_data["me"],
      'Croatia'                => @country_data["hr"],
      'Albania'                => @country_data["al"],
      'Serbia'                 => @country_data["rs"],
      'Macedonia'              => @country_data["mk"],
      'Kosovo'                 => @country_data["xk"],
      'Slovenia'               => @country_data["si"],
      'BIH' => @country_data["ba"],
      'MNE' => @country_data["me"],
      'HRV' => @country_data["hr"],
      'ALB' => @country_data["al"],
      'SRB' => @country_data["rs"],
      'MKD' => @country_data["mk"],
      'KOS' => @country_data["xk"],
      'SVN' => @country_data["si"]
    }
  end
  attr_reader :type_mappings, :country_mappings

  def strip_pa_prefix(country_name, pa_name)
    return pa_name if country_name == "Croatia" || country_name == "HRV"
    pa_name.gsub("PP", "").gsub("NP", "").strip
  end

  def codify_pa(cntry, pa)
    strip_pa_prefix(cntry, pa).gsub(/::/, '/').gsub(/\s+/, ' ').gsub(/\s/, '-').gsub(/([A-Z]+)([A-Z][a-z])/,'\1_\2').gsub(/([a-z\d])([A-Z])/,'\1_\2').tr("-", "_").downcase
  end
end
