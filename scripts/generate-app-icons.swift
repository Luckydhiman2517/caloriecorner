#!/usr/bin/env swift
// Draws the Calorie Corner app mark (Brand guidelines · 02 Logo: a Forest Ink
// tile, a Turmeric quarter-disc and an outlined white "c") into every PNG the
// iOS and Android projects need. Run from the repo root:
//
//   swift scripts/generate-app-icons.swift
//
// Android 8+ uses the vector adaptive icon in res/drawable and
// res/mipmap-anydpi-v26 instead; keep its shapes in sync with this file.
// Geometry is in the mark's 40×40 units, the same as src/components/Logo.tsx.

import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let forestInk = CGColor(srgbRed: 0x17 / 255, green: 0x23 / 255, blue: 0x1C / 255, alpha: 1)
let turmeric = CGColor(srgbRed: 0xE3 / 255, green: 0xA6 / 255, blue: 0x3A / 255, alpha: 1)
let white = CGColor(srgbRed: 1, green: 1, blue: 1, alpha: 1)

enum Clip {
  case square      // full-bleed: the platform applies its own mask
  case roundedTile // the brand tile, r12 of 40
  case circle
}

/// Renders the mark with its 40-unit tile spanning `tile` px, centred on a
/// `canvas` px square. Opaque images have no alpha channel (iOS requires it).
func render(canvas: Int, tile: Double, clip: Clip, opaque: Bool) -> CGImage {
  let space = CGColorSpace(name: CGColorSpace.sRGB)!
  let alpha = opaque ? CGImageAlphaInfo.noneSkipLast : CGImageAlphaInfo.premultipliedLast
  let ctx = CGContext(
    data: nil, width: canvas, height: canvas, bitsPerComponent: 8, bytesPerRow: 0,
    space: space, bitmapInfo: alpha.rawValue)!
  ctx.interpolationQuality = .high
  ctx.setShouldAntialias(true)

  // Work in the mark's units with y pointing down, like the SVG.
  let offset = (Double(canvas) - tile) / 2
  ctx.translateBy(x: offset, y: Double(canvas) - offset)
  ctx.scaleBy(x: tile / 40, y: -tile / 40)

  let box = CGRect(x: 0, y: 0, width: 40, height: 40)
  ctx.saveGState()
  switch clip {
  case .square: ctx.clip(to: box)
  case .roundedTile:
    ctx.addPath(CGPath(roundedRect: box, cornerWidth: 12, cornerHeight: 12, transform: nil))
    ctx.clip()
  case .circle:
    ctx.addEllipse(in: box)
    ctx.clip()
  }
  ctx.setFillColor(forestInk)
  ctx.fill(box)
  // Quarter-disc: circle cx 40 cy 40 r 17, clipped by the tile.
  ctx.setFillColor(turmeric)
  ctx.fillEllipse(in: CGRect(x: 23, y: 23, width: 34, height: 34))
  ctx.restoreGState()

  // "c": SVG arc M21.6 14.4 A7.2 7.2 0 1 0 21.6 25.6, stroke 4.2, round caps.
  let r = 7.2
  let cx = 21.6 - (r * r - 5.6 * 5.6).squareRoot()
  let c = CGMutablePath()
  c.addArc(
    center: CGPoint(x: cx, y: 20), radius: r,
    startAngle: atan2(-5.6, 21.6 - cx), endAngle: atan2(5.6, 21.6 - cx),
    clockwise: true)
  ctx.addPath(c)
  ctx.setStrokeColor(white)
  ctx.setLineWidth(4.2)
  ctx.setLineCap(.round)
  ctx.strokePath()

  return ctx.makeImage()!
}

func write(_ image: CGImage, to path: String) {
  let url = URL(fileURLWithPath: path)
  try! FileManager.default.createDirectory(
    at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
  let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(dest, image, nil)
  guard CGImageDestinationFinalize(dest) else { fatalError("Could not write \(path)") }
  print("wrote \(path) (\(image.width)px)")
}

let ios = "ios/CalorieCorner/Images.xcassets"
let res = "android/app/src/main/res"

// iOS app icon: one 1024 px full-bleed square; Xcode makes the other sizes.
write(render(canvas: 1024, tile: 1024, clip: .square, opaque: true),
      to: "\(ios)/AppIcon.appiconset/AppIcon-1024.png")

// iOS launch screen: the rounded tile at 96 pt.
for (scale, suffix) in [(1, ""), (2, "@2x"), (3, "@3x")] {
  let px = 96 * scale
  write(render(canvas: px, tile: Double(px), clip: .roundedTile, opaque: false),
        to: "\(ios)/LaunchLogo.imageset/LaunchLogo\(suffix).png")
}

// Android 7 and older (no adaptive icons): 48 dp icons with a 2 dp margin.
for (density, px) in [("mdpi", 48), ("hdpi", 72), ("xhdpi", 96), ("xxhdpi", 144), ("xxxhdpi", 192)] {
  let tile = Double(px) * 44 / 48
  write(render(canvas: px, tile: tile, clip: .roundedTile, opaque: false),
        to: "\(res)/mipmap-\(density)/ic_launcher.png")
  write(render(canvas: px, tile: tile, clip: .circle, opaque: false),
        to: "\(res)/mipmap-\(density)/ic_launcher_round.png")
}

// Google Play listing icon: 512 px full-bleed square (Play rounds the corners).
write(render(canvas: 512, tile: 512, clip: .square, opaque: true),
      to: "android/app/src/main/ic_launcher-playstore.png")
