#!/usr/bin/env bash

##############################################################################
##
##  Script switch YH-Android apps for UN*X
##
##############################################################################

case "$1" in
  yh_android|shengyiplus|qiyoutong|yonghuitest|test)
    # bundle exec ruby config/app_keeper.rb --app=shengyiplus --gradle --mipmap --manifest --res --java --apk --pgyer
    bundle exec ruby config/app_keeper.rb --app="$1" --gradle --mipmap --manifest --res --java
  ;;
  pgyer)
    bundle exec ruby config/app_keeper.rb --app="$(cat .current-app)" --apk --pgyer
  ;;
  github)
    bundle exec ruby config/app_keeper.rb --github
  ;;
  view)
    bundle exec ruby config/app_keeper.rb --view
  ;;
  deploy)
    bash "$0" shengyiplus
    bash "$0" pgyer
    bash "$0" qiyoutong
    bash "$0" pgyer
    bash "$0" yh_android
    bash "$0" pgyer
  ;;
  all)
    echo 'TODO'
  ;;
  *)
    if [[ -z "$1" ]]; then
      bundle exec ruby config/app_keeper.rb --check
    else
      echo "unknown argument - $1"
    fi
  ;;
esac


check_assets() {
    local shared_path="pm_android/Shared/"

    if [[ -z "$1" ]];
    then
        echo "ERROR: please offer assets filename"
        exit
    fi

    local filename="$1.zip"
    local filepath="$shared_path/$filename"
    local url="http://123.56.91.131:8090/api/v1/download/$1.zip"

    echo -e "\n## $filename\n"
    local status_code=$(curl -s -o /dev/null -I -w "%{http_code}" $url)

    if [[ "$status_code" != "200" ]];
    then
        echo "ERROR: $status_code - $url"
        exit
    fi
    echo "- http response 200."

    curl -s -o $filename $url
    echo "- download $([[ $? -eq 0 ]] && echo 'successfully' || echo 'failed')"

    local md5_server=$(md5 ./$filename | cut -d ' ' -f 4)
    local md5_local=$(md5 ./$filepath | cut -d ' ' -f 4)

    if [[ "$md5_server" = "$md5_local" ]];
    then
        echo "- not modified."
        test -f $filename && rm $filename
    else
        mv $filename $filepath
        echo "- $filename updated."
    fi
}

case "$1" in
    yonghui|shengyiplus|qiyoutong|yonghuitest|test)
        # bundle exec ruby config/app_keeper.rb --plist --assets --constant
        bundle exec ruby config/app_keeper.rb --app="$1" --plist --assets --constant
    ;;
    ...
    ;;
    assets:check)
        check_assets "offline_pages"
        check_assets "BarCodeScan"
        check_assets "advertisement"
        check_assets "assets"
        check_assets "fonts"
        check_assets "images"
        check_assets "javascripts"
        check_assets "stylesheets"
    ;;
    *)
        test -z "$1" && echo "current app: $(cat .current-app)" || echo "unknown argument - $1"
    ;;
esac
