// Generates the iOS apple-touch-startup-image PNGs in public/splash/ and prints
// the matching <link> tags for index.html. Run from the repo root:
//
//   swift scripts/generate-startup-images.swift
//
// Each image is the splash from index.html at its first frame: the theme
// background with the face (first frame of money-face.webp) FACE_POINTS wide,
// centred. Keep BACKGROUNDS in sync with index.html / --background in index.css,
// and FACE_POINTS with `#splash img` in index.html.

import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let FACE_POINTS: CGFloat = 96
let BACKGROUNDS: [(name: String, rgb: (CGFloat, CGFloat, CGFloat))] = [
  ("light", (0xf2 / 255, 0xf2 / 255, 0xf7 / 255)),
  ("dark", (0, 0, 0)),
]

// Portrait iPhone screens: CSS points (device-width x device-height) and scale
let SCREENS: [(w: Int, h: Int, scale: Int)] = [
  (440, 956, 3),  // 16 Pro Max, 17 Pro Max
  (420, 912, 3),  // Air
  (402, 874, 3),  // 16 Pro, 17, 17 Pro
  (430, 932, 3),  // 14 Pro Max, 15 Plus / Pro Max, 16 Plus
  (393, 852, 3),  // 14 Pro, 15, 15 Pro, 16, 16e
  (428, 926, 3),  // 12 / 13 Pro Max, 14 Plus
  (390, 844, 3),  // 12, 12 Pro, 13, 13 Pro, 14
  (414, 896, 3),  // XS Max, 11 Pro Max
  (414, 896, 2),  // XR, 11
  (375, 812, 3),  // X, XS, 11 Pro, 12 / 13 mini
  (414, 736, 3),  // 6 / 7 / 8 Plus
  (375, 667, 2),  // 6 / 7 / 8, SE (2nd, 3rd gen)
  (320, 568, 2),  // 5s, SE (1st gen)
]

let root = FileManager.default.currentDirectoryPath
let outDir = "\(root)/public/splash"
try FileManager.default.createDirectory(
  atPath: outDir, withIntermediateDirectories: true)

guard
  let source = CGImageSourceCreateWithURL(
    URL(fileURLWithPath: "\(root)/public/images/money-face.webp") as CFURL, nil),
  let face = CGImageSourceCreateImageAtIndex(source, 0, nil)
else { fatalError("cannot read public/images/money-face.webp") }

let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
var links: [String] = []

for screen in SCREENS {
  for background in BACKGROUNDS {
    let width = screen.w * screen.scale
    let height = screen.h * screen.scale
    let context = CGContext(
      data: nil, width: width, height: height, bitsPerComponent: 8,
      bytesPerRow: 0, space: colorSpace,
      bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
    context.setFillColor(
      red: background.rgb.0, green: background.rgb.1, blue: background.rgb.2,
      alpha: 1)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.interpolationQuality = .high
    let side = FACE_POINTS * CGFloat(screen.scale)
    context.draw(
      face,
      in: CGRect(
        x: (CGFloat(width) - side) / 2, y: (CGFloat(height) - side) / 2,
        width: side, height: side))

    let file =
      "splash-\(screen.w)x\(screen.h)@\(screen.scale)x-\(background.name).png"
    let url = URL(fileURLWithPath: "\(outDir)/\(file)")
    let destination = CGImageDestinationCreateWithURL(
      url as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(destination, context.makeImage()!, nil)
    precondition(CGImageDestinationFinalize(destination), "cannot write \(file)")

    links.append(
      "    <link rel=\"apple-touch-startup-image\" href=\"splash/\(file)\" media=\"(device-width: \(screen.w)px) and (device-height: \(screen.h)px) and (-webkit-device-pixel-ratio: \(screen.scale)) and (orientation: portrait) and (prefers-color-scheme: \(background.name))\" />"
    )
  }
}

print(links.joined(separator: "\n"))
