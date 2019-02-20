import { HalTreeModule } from './hal-tree.module';

describe('HalTreeModule', () => {
  let halTreeModule: HalTreeModule;

  beforeEach(() => {
    halTreeModule = new HalTreeModule();
  });

  it('should create an instance', () => {
    expect(halTreeModule).toBeTruthy();
  });
});
