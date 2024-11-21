"use client";

import Spinner from "@/app/components/Spinner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { motion } from "framer-motion";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { SignInButton, useUser } from "@clerk/nextjs";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Header from "./components/Header";
//import Footer from "./components/Footer";
import { domain } from "@/app/lib/domain";
import InfoTooltip from "./components/InfoToolTip";

// const layouts = [
//   { name: "Solo", icon: "/solo.svg" },
//   { name: "Side", icon: "/side.svg" },
//   { name: "Stack", icon: "/stack.svg" },
// ];

const logoStyles = [
  { name: "科技", icon: "/tech.svg" },
  { name: "闪亮", icon: "/flashy.svg" },
  { name: "现代", icon: "/modern.svg" },
  { name: "活泼", icon: "/playful.svg" },
  { name: "抽象", icon: "/abstract.svg" },
  { name: "极简", icon: "/minimal.svg" },
];

const primaryColors = [
  { name: "蓝色", color: "#0F6FFF" },
  { name: "红色", color: "#FF0000" },
  { name: "绿色", color: "#00FF00" },
  { name: "黄色", color: "#FFFF00" },
];

const backgroundColors = [
  { name: "白色", color: "#FFFFFF" },
  { name: "灰色", color: "#CCCCCC" },
  { name: "黑色", color: "#000000" },
];

// 添加模型选择选项
const models = [
  { name: "fluxdev", value: "fluxdev-c" },
  { name: "fluxpro", value: "fluxpro-c" },
  { name: "flux", value: "flux-c" },
  { name: "sd35", value: "sd35-c" },
  { name: "sd3", value: "sd3-c" },
  { name: "sdxlpro", value: "sdxlpro-c" },
  { name: "sdxl", value: "sdxl-c" },
  { name: "sd2", value: "sd2-c" },
  { name: "dall-e-3", value: "dall-e-3" },
];

export default function Page() {
  // 在 Page 组件中添加状态
  const [selectedModel, setSelectedModel] = useState(models[0].value);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const [companyName, setCompanyName] = useState("");
  // const [selectedLayout, setSelectedLayout] = useState(layouts[0].name);
  const [selectedStyle, setSelectedStyle] = useState(logoStyles[0].name);
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(
    primaryColors[0].name,
  );
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    backgroundColors[0].name,
  );
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isSignedIn, isLoaded, user } = useUser();

  async function generateLogo() {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);

    // 在 generateLogo 函数中添加 selectedModel
    const res = await fetch("/api/generate-logo", {
      method: "POST",
      body: JSON.stringify({
        companyName,
        // selectedLayout,
        selectedStyle,
        selectedPrimaryColor,
        selectedBackgroundColor,
        additionalInfo,
        selectedModel,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      setGeneratedImageUrl(json.imageUrl); // 直接使用返回的图片URL
      await user.reload();
    } else {
      toast({
        variant: "destructive",
        title: "Whoops!",
        description: `There was a problem processing your request: ${res.statusText}`,
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="flex h-screen flex-col overflow-y-auto overflow-x-hidden bg-[#343434] md:flex-row">
      <Header className="block md:hidden" />

      <div className="flex w-full flex-col md:flex-row">
        <div className="relative flex h-full w-full flex-col bg-[#2C2C2C] text-[#F3F3F3] md:max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setGeneratedImageUrl("");
              generateLogo();
            }}
            className="flex h-full w-full flex-col"
          >
            <fieldset className="flex grow flex-col" disabled={!isSignedIn}>
              <div className="flex-grow overflow-y-auto">
                <div className="px-8 pb-0 pt-4 md:px-6 md:pt-6">


<div className="mb-6">
  <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
    模型选择
    <InfoTooltip content="选择要使用的 AI 模型" />
  </label>
  <Select
    value={selectedModel}
    onValueChange={setSelectedModel}
  >
    <SelectTrigger>
      <SelectValue placeholder="选择模型" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {models.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            {model.name}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
</div>
                  
                  <div className="-mx-6 mb-6 h-px w-[calc(100%+48px)] bg-[#343434]"></div>
                  <div className="mb-6">
                    <label
                      htmlFor="company-name"
                      className="mb-2 block text-xs font-bold uppercase text-[#6F6F6F]"
                    >
                      公司名称
                    </label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="猛然工作室"
                      required
                    />
                  </div>
                  {/* Layout Section */}
                  {/* <div className="mb-6">
                    <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
                      Layout
                      <InfoTooltip content="Select a layout for your logo" />
                    </label>
                    <RadioGroup.Root
                      value={selectedLayout}
                      onValueChange={setSelectedLayout}
                      className="group/root grid grid-cols-3 gap-3"
                    >
                      {layouts.map((layout) => (
                        <RadioGroup.Item
                          value={layout.name}
                          key={layout.name}
                          className="group text-[#6F6F6F] focus-visible:outline-none data-[state=checked]:text-white"
                        >
                          <Image
                            src={layout.icon}
                            alt={layout.name}
                            width={96}
                            height={96}
                            className="w-full rounded-md border border-transparent group-focus-visible:outline group-focus-visible:outline-offset-2 group-focus-visible:outline-gray-400 group-data-[state=checked]:border-white"
                          />
                          <span className="text-xs">{layout.name}</span>
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </div> */}
                  {/* Logo Style Section */}
                  <div className="mb-6">
                    <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
                      风格
                      <InfoTooltip content="为您想要设计的 logo 选择一个合适的风格" />
                    </label>
                    <RadioGroup.Root
                      value={selectedStyle}
                      onValueChange={setSelectedStyle}
                      className="grid grid-cols-3 gap-3"
                    >
                      {logoStyles.map((logoStyle) => (
                        <RadioGroup.Item
                          value={logoStyle.name}
                          key={logoStyle.name}
                          className="group text-[#6F6F6F] focus-visible:outline-none data-[state=checked]:text-white"
                        >
                          <Image
                            src={logoStyle.icon}
                            alt={logoStyle.name}
                            width={96}
                            height={96}
                            className="w-full rounded-md border border-transparent group-focus-visible:outline group-focus-visible:outline-offset-2 group-focus-visible:outline-gray-400 group-data-[state=checked]:border-white"
                          />
                          <span className="text-xs">{logoStyle.name}</span>
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </div>
                  {/* Color Picker Section */}
                  <div className="mb-[25px] flex flex-col md:flex-row md:space-x-3">
                    <div className="mb-4 flex-1 md:mb-0">
                      <label className="mb-1 block text-xs font-bold uppercase text-[#6F6F6F]">
                        主要颜色
                      </label>
                      <Select
                        value={selectedPrimaryColor}
                        onValueChange={setSelectedPrimaryColor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {primaryColors.map((color) => (
                              <SelectItem key={color.color} value={color.name}>
                                <span className="flex items-center">
                                  <span
                                    style={{ backgroundColor: color.color }}
                                    className="mr-2 size-4 rounded-sm bg-white"
                                  />
                                  {color.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block items-center text-xs font-bold uppercase text-[#6F6F6F]">
                        背景色
                      </label>
                      <Select
                        value={selectedBackgroundColor}
                        onValueChange={setSelectedBackgroundColor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {backgroundColors.map((color) => (
                              <SelectItem key={color.color} value={color.name}>
                                <span className="flex items-center">
                                  <span
                                    style={{ backgroundColor: color.color }}
                                    className="mr-2 size-4 rounded-sm bg-white"
                                  />
                                  {color.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Additional Options Section */}
                  <div className="mb-1">
                    <div className="mt-1">
                      <div className="mb-1">
                        <label
                          htmlFor="additional-info"
                          className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]"
                        >
                          更多信息
                          <InfoTooltip content="请提供关于您需要设计的 logo 的更多信息" />
                        </label>
                        <Textarea
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          placeholder="请提供更多信息"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-8 py-4 md:px-6 md:py-6">
                <Button
                  size="lg"
                  className="w-full text-base font-bold"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loader mr-2" />
                  ) : (
                    <Image
                      src="/generate-icon.svg"
                      alt="Generate Icon"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                  )}
                  {isLoading ? "加载中..." : "生成 Logo"}{" "}
                </Button>
              </div>
            </fieldset>
          </form>

          {isLoaded && !isSignedIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 px-6"
            >
              <div className="rounded bg-gray-200 p-4 text-gray-900">
                <p className="text-lg">
                  创建一个免费账号开始生成 logos:
                </p>

                <div className="mt-4">
                  <SignInButton
                    mode="modal"
                    signUpForceRedirectUrl={domain}
                    forceRedirectUrl={domain}
                  >
                    <Button
                      size="lg"
                      className="w-full text-base font-semibold"
                      variant="secondary"
                    >
                      登录
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex w-full flex-col pt-12 md:pt-0">
          <Header className="hidden md:block" />{" "}
          {/* Show header on larger screens */}
          <div className="relative flex flex-grow items-center justify-center px-4">
            <div className="relative aspect-square w-full max-w-lg">
              {generatedImageUrl ? (
                <>
                  <Image
                    className={`${isLoading ? "animate-pulse" : ""}`}
                    width={512}
                    height={512}
                    src={generatedImageUrl} // 使用URL而不是base64
                    alt=""
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 transition ${isLoading ? "bg-black/50 duration-500" : "bg-black/0 duration-0"}`}
                  />

                  <div className="absolute -right-12 top-0 flex flex-col gap-2">
                    <Button size="icon" variant="secondary" asChild>
                      <a href={generatedImageUrl} download="logo.png">
                        <DownloadIcon />
                      </a>
                    </Button>
                    <Button
                      size="icon"
                      onClick={generateLogo}
                      variant="secondary"
                    >
                      <Spinner loading={isLoading}>
                        <RefreshCwIcon />
                      </Spinner>
                    </Button>
                  </div>
                </>
              ) : (
                <Spinner loading={isLoading} className="size-8 text-white">
                  <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-[#2C2C2C]">
                    <h4 className="text-center text-base leading-tight text-white">
                      在 10 秒钟内
                      <br />
                      生成您的理想 logo ！
                    </h4>
                  </div>
                </Spinner>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
