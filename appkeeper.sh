#!/usr/bin/env bash

##############################################################################
##
##  Script switch YH-Android apps for UN*X
##
##############################################################################

check_assets() {
    local shared_path="app/src/main/assets"

    if [[ -z "$1" ]];
    then
        echo "ERROR: please offer assets filename"
        exit
    fi

    local filename="$1.zip"
    local filepath="$shared_path/$filename"
    local url="$url/api/v1/download/$1.zip"

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
	
	mv $filename $filepath

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
    shimao:assets:check)
		url="http://180.169.70.19"
        check_assets "offline_pages"
        check_assets "BarCodeScan"
        check_assets "advertisement"
        check_assets "assets"
        check_assets "fonts"
        check_assets "images"
        check_assets "javascripts"
        check_assets "stylesheets"
        check_assets "offline_pages_html"
        check_assets "offline_pages_images"
        check_assets "offline_pages_javascripts"
        check_assets "offline_pages_stylesheets"
    ;;
	qifu:assets:check)
		url="http://123.56.91.131:8090"
        check_assets "offline_pages"
        check_assets "BarCodeScan"
        check_assets "advertisement"
        check_assets "assets"
        check_assets "fonts"
        check_assets "images"
        check_assets "javascripts"
        check_assets "stylesheets"
        check_assets "offline_pages_html"
        check_assets "offline_pages_images"
        check_assets "offline_pages_javascripts"
        check_assets "offline_pages_stylesheets"
    ;;
    shimao)
        # 替换 build.gradle 中 applicationId的值
        build_path="app/build.gradle"
        sed -i '' "s/applicationId .*/applicationId \'com.hd.shimao\'/" $build_path

        # 替换第三方的key
        androidmanifest_path="app/src/main/AndroidManifest.xml"
        payer_findline=`sed -n '/"PGYER_APPID"/=' $androidmanifest_path`
        let line="payer_findline + 1" 
        sed -i '' "$line s/^.*$/          android\:value=\"0577088f67fa8e39bda5afe4aaeda053\" \/\>/" $androidmanifest_path

        umeng_key_findline=`sed -n '/"UMENG_APPKEY"/=' $androidmanifest_path`
        let line="umeng_key_findline + 1" 
        sed -i '' "$line s/^.*$/          android\:value=\"58f70c7107fe65118a0004f3\" \/\>/" $androidmanifest_path

        umeng_message_findline=`sed -n '/"UMENG_MESSAGE_SECRET"/=' $androidmanifest_path`
        let line="umeng_message_findline + 1" 
        sed -i '' "$line s/^.*$/          android\:value=\"a06c12f5b3c1275b7ed4d32e75596f65\" \/\>/" $androidmanifest_path

        # 图片与图标替换
        icon_config="config/Assets/mipmap-shimao/"
        icon_app="app/src/main/res"
        cp -rp $icon_config $icon_app

        # 替换APP名字
        string_path="app/src/main/res/values/strings.xml"
        let string_findline=`sed -n '/"app_name"/=' $string_path`
        sed -i '' "$string_findline s/^.*$/    \<string name=\"app_name\"\>HDMCRE\<\/string\>/" $string_path

        # 替换privateURLs.java中kBaseUrl中的域名
        private_urls_path=$(find . -name PrivateURLs.java -print)
        sed -i '' "s/BaseUrl .*/BaseUrl = \"http:\/\/180\.169\.70\.19\";/" $private_urls_path
    ;;
    qifu)

        # 替换 build.gradle 中 applicationId的值
        build_path="app/build.gradle"
        sed -i '' "s/applicationId .*/applicationId \'com.intfocus.hdmcre\'/" $build_path

        # 替换第三方的key
        androidmanifest_path="app/src/main/AndroidManifest.xml"
        payer_findline=`sed -n '/"PGYER_APPID"/=' $androidmanifest_path`
        let line="payer_findline + 1" 
        sed -i '' "$line s/^.*$/          android\:value=\"34fc202939786006778b8ddc810486ca\" \/\>/" $androidmanifest_path

        umeng_key_findline=`sed -n '/"UMENG_APPKEY"/=' $androidmanifest_path`
        let line="umeng_key_findline + 1" 
        sed -i '' "$line s/^.*$/          android\:value=\"58bcf7e9c62dca1f8f001583\" \/\>/" $androidmanifest_path

        umeng_message_findline=`sed -n '/"UMENG_MESSAGE_SECRET"/=' $androidmanifest_path`
        let line="umeng_message_findline + 1" 
        sed -i '' "$line s/^.*$/          android\:value=\"7065ec5133d7d6d7e21ed8c18743ce0b\" \/\>/" $androidmanifest_path

        # 图片与图标替换
        icon_config="config/Assets/mipmap-qifu/"
        icon_app="app/src/main/res"
        cp -rp $icon_config $icon_app

        # 替换APP名字
        string_path="app/src/main/res/values/strings.xml"
        let string_findline=`sed -n '/"app_name"/=' $string_path`
        sed -i '' "$string_findline s/^.*$/    \<string name=\"app_name\"\>HDMCRE\<\/string\>/" $string_path

        # 替换privateURLs.java中kBaseUrl中的域名
        private_urls_path=$(find . -name PrivateURLs.java -print)
        sed -i '' 's/BaseUrl .*/BaseUrl = \"http:\/\/123\.56\.91\.131\:8090\";/' $private_urls_path
    ;;
    *)
        test -z "$1" && echo "current app: $(cat .current-app)" || echo "unknown argument - $1"
    ;;
esac
